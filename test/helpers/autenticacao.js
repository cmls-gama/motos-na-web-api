const request = require('supertest');
require('dotenv').config();

const postAuthGerente = require('../fixtures/postAuthGerente.json');
const postAuthUsuario = require('../fixtures/postAuthUsuario.json');

const autenticar = async (credenciais, perfil) => {
  const resposta = await request(process.env.BASE_URL)
    .post('/api/auth/login')
    .set('Content-Type', 'application/json')
    .send(credenciais);

  if (resposta.status !== 200 || !resposta.body.token) {
    throw new Error(
      `Falha ao obter token do ${perfil}. Status: ${resposta.status}`
    );
  }

  return resposta.body.token;
};

const obterTokenGerente = async () => {
  return autenticar(postAuthGerente, 'gerente');
};

const obterTokenUsuario = async () => {
  return autenticar(postAuthUsuario, 'usuário');
};

module.exports = {
  obterTokenGerente,
  obterTokenUsuario
};