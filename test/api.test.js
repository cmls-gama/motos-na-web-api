process.env.JWT_SECRET = 'test-secret-with-enough-entropy-for-automated-tests';
process.env.MANAGER_PASSWORD = 'manager-test-password';
process.env.USER_PASSWORD = 'user-test-password';

const { beforeEach, describe, it } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');
const motorcycleModel = require('../src/models/motorcycleModel');

async function login(username, password) {
  const response = await request(app).post('/api/auth/login').send({ username, password });
  assert.equal(response.status, 200);
  return response.body.token;
}

const validMotorcycle = {
  brand: 'Honda',
  model: 'CB 500F',
  year: 2025,
  color: 'Vermelha',
  engineCapacityCc: 471,
};

beforeEach(() => motorcycleModel.clear());

describe('Autenticação e autorização', () => {
  it('retorna JWT para credenciais válidas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'gerente', password: 'manager-test-password' });

    assert.equal(response.status, 200);
    assert.equal(response.body.user.role, 'manager');
    assert.equal(typeof response.body.token, 'string');
  });

  it('retorna 401 sem token ou com token inválido', async () => {
    const missing = await request(app).get('/api/motorcycles');
    const invalid = await request(app)
      .get('/api/motorcycles')
      .set('Authorization', 'Bearer token-invalido');

    assert.equal(missing.status, 401);
    assert.equal(invalid.status, 401);
    assert.deepEqual(Object.keys(missing.body), ['error']);
  });

  it('permite consulta ao usuário comum, mas bloqueia escrita com 403', async () => {
    const token = await login('usuario', 'user-test-password');
    const read = await request(app)
      .get('/api/motorcycles')
      .set('Authorization', `Bearer ${token}`);
    const write = await request(app)
      .post('/api/motorcycles')
      .set('Authorization', `Bearer ${token}`)
      .send(validMotorcycle);

    assert.equal(read.status, 200);
    assert.equal(write.status, 403);
  });
});

describe('CRUD de motocicletas', () => {
  it('executa criação, consulta, edição e remoção como gerente', async () => {
    const token = await login('gerente', 'manager-test-password');
    const authorization = { Authorization: `Bearer ${token}` };

    const created = await request(app)
      .post('/api/motorcycles')
      .set(authorization)
      .send(validMotorcycle);
    assert.equal(created.status, 201);
    assert.match(created.body.data.id, /^[0-9a-f-]{36}$/i);

    const id = created.body.data.id;
    const found = await request(app).get(`/api/motorcycles/${id}`).set(authorization);
    assert.equal(found.status, 200);
    assert.equal(found.body.data.model, 'CB 500F');

    const updated = await request(app)
      .put(`/api/motorcycles/${id}`)
      .set(authorization)
      .send({ color: 'Preta' });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.data.color, 'Preta');

    const removed = await request(app).delete(`/api/motorcycles/${id}`).set(authorization);
    assert.equal(removed.status, 204);

    const missing = await request(app).get(`/api/motorcycles/${id}`).set(authorization);
    assert.equal(missing.status, 404);
  });

  it('retorna 400 para dados inválidos no formato padronizado', async () => {
    const token = await login('gerente', 'manager-test-password');
    const response = await request(app)
      .post('/api/motorcycles')
      .set('Authorization', `Bearer ${token}`)
      .send({ brand: 'Honda' });

    assert.equal(response.status, 400);
    assert.equal(typeof response.body.error, 'string');
  });
});

describe('Documentação', () => {
  it('disponibiliza o OpenAPI e a interface Swagger', async () => {
    const document = await request(app).get('/api-docs.json');
    const ui = await request(app).get('/api-docs/');

    assert.equal(document.status, 200);
    assert.equal(document.body.openapi, '3.0.3');
    assert.equal(ui.status, 200);
    assert.match(ui.text, /Swagger UI/);
  });
});
