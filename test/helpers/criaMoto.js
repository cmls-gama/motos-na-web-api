const request = require('supertest');
require('dotenv').config();

const postMotorcycles = require('../fixtures/postMotorcycles.json');

const criarMoto = async (token, dados = postMotorcycles) => {
    const resposta = await request(process.env.BASE_URL)
        .post('/api/motorcycles')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...dados });

    if (resposta.status !== 201) {
        throw new Error(
            `Falha ao criar motocicleta. Status: ${resposta.status}. `
            + `Resposta: ${JSON.stringify(resposta.body)}`
        );
    }

    const motocicleta = resposta.body.data;

    if (!motocicleta || typeof motocicleta.id !== 'string') {
        throw new Error('A API não retornou uma motocicleta com ID válido.');
    }

    return motocicleta;
};

module.exports = {
    criarMoto
};