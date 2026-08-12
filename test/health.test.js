const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

describe('Health Check', () => {
    describe('GET /health', () => {
        it('Deve retornar 200 e informar que a API está disponível', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/health');

            expect(resposta.status).to.equal(201);
            expect(resposta.headers['content-type']).to.include('application/json');
            expect(resposta.body).to.deep.equal({ status: 'ok' });
        });
    });
});
