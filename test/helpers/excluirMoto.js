const request = require('supertest');
require('dotenv').config();

const postAuthGerente = require('../fixtures/postAuthGerente.json');

const excluirMoto = async (idMoto, tokenGerente) => {
    const resposta = await request(process.env.BASE_URL)
        .delete(`/api/motorcycles/${idMoto}`)
        .set('Authorization', `Bearer ${tokenGerente}`);

    if (resposta.status !== 204){
        throw new Error (`Falha ao exlcuir motocicleta ${idMoto}. Status: ${resposta.status}`);
    }
};

module.exports = {
    excluirMoto
};