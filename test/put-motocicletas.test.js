const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const putMotorcycles = require('./fixtures/putMotorcycles.json');
const { obterTokenGerente, obterTokenUsuario } = require('./helpers/autenticacao');
const { criarMoto } = require('./helpers/criaMoto');

describe('Put Motorcycles', () => {
    let tokenGerente;
    let tokenUsuario;
    const tokenInvalido = 'testes';
    const idMotoInvalido = '2342342';

    before(async () => {
        tokenGerente = await obterTokenGerente();
        tokenUsuario = await obterTokenUsuario();
    })

    describe('PUT/api/motorcycles', () => {
        it('Deve retornar 200 ao atualizar uma motocicleta como gerente', async () => {
            const motocicletaCriada = await criarMoto(tokenGerente);
            const idMoto = motocicletaCriada.id;
            const bodyMotorcycles = { ...putMotorcycles };

            try {
                const resposta = await request(process.env.BASE_URL)
                    .put(`/api/motorcycles/${idMoto}`)
                    .set('Content-Type', 'application/json')
                    .set('Authorization', `Bearer ${tokenGerente}`)
                    .send(bodyMotorcycles);

                expect(resposta.status).to.equal(200);
                expect(resposta.body.data.id).to.equal(idMoto);
                expect(resposta.body.data.brand).to.equal(bodyMotorcycles.brand);
                expect(resposta.body.data.model).to.equal(bodyMotorcycles.model);
                expect(resposta.body.data.year).to.equal(bodyMotorcycles.year);
                expect(resposta.body.data.color).to.equal(bodyMotorcycles.color);
                expect(resposta.body.data.engineCapacityCc).to.equal(bodyMotorcycles.engineCapacityCc);

            } finally {
                const limpeza = await request(process.env.BASE_URL)
                    .delete(`/api/motorcycles/${idMoto}`)
                    .set('Authorization', `Bearer ${tokenGerente}`);
                //verifica se a exclusão foi feita com sucesso.
                if (limpeza.status !== 204) {
                    throw new Error(
                        `Falha ao limpar motocicleta ${idMoto}. `
                        + `Status: ${limpeza.status}`
                    );
                }
            }
        });
        it('Deve retornar 400 ao tentar atualizar sem informar campos', async () => {
            const motocicletaCriada = await criarMoto(tokenGerente);
            const idMoto = motocicletaCriada.id;

            try {
                const resposta = await request(process.env.BASE_URL)
                    .put(`/api/motorcycles/${idMoto}`)
                    .set('Content-Type', 'application/json')
                    .set('Authorization', `Bearer ${tokenGerente}`)
                    .send({});

                expect(resposta.status).to.equal(400);
                expect(resposta.body).to.have.property(
                    'error',
                    'Informe ao menos um campo para atualização.'
                );
            } finally {
                const limpeza = await request(process.env.BASE_URL)
                    .delete(`/api/motorcycles/${idMoto}`)
                    .set('Authorization', `Bearer ${tokenGerente}`);
                //verifica se a exclusão foi feita com sucesso.
                if (limpeza.status !== 204) {
                    throw new Error(
                        `Falha ao limpar motocicleta ${idMoto}. `
                        + `Status: ${limpeza.status}`
                    );
                }
            }
        });

        it('Deve retornar 401 ao tentar atualizar com token inválido', async () => {
            const motocicletaCriada = await criarMoto(tokenGerente);
            const idMoto = motocicletaCriada.id;
            const bodyMotorcycles = { ...putMotorcycles };

            try {
                const resposta = await request(process.env.BASE_URL)
                    .put(`/api/motorcycles/${idMoto}`)
                    .set('Content-Type', 'application/json')
                    .set('Authorization', `Bearer ${tokenInvalido}`)
                    .send(bodyMotorcycles);

                expect(resposta.status).to.equal(401);
                expect(resposta.body).to.have.property(
                    'error',
                    'Token inválido ou expirado.'
                );
            } finally {
                const limpeza = await request(process.env.BASE_URL)
                    .delete(`/api/motorcycles/${idMoto}`)
                    .set('Authorization', `Bearer ${tokenGerente}`);

                if (limpeza.status !== 204) {
                    throw new Error(
                        `Falha ao limpar motocicleta ${idMoto}. `
                        + `Status: ${limpeza.status}`
                    );
                }
            }
        });

        it('Deve retornar 403 ao realizar uma requisição put com token de usuário', async () => {
            const motocicletaCriada = await criarMoto(tokenGerente);
            const idMoto = motocicletaCriada.id;
            const bodyMotorcycles = { ...putMotorcycles };

            try {
                const resposta = await request(process.env.BASE_URL)
                    .put(`/api/motorcycles/${idMoto}`)
                    .set('Content-Type', 'application/json')
                    .set('Authorization', `Bearer ${tokenUsuario}`)
                    .send(bodyMotorcycles)

                //Validações com o CHAI
                expect(resposta.status).to.be.equal(403);
                // Verifica se contém determinado trecho
                expect(resposta.body.error).to.include('Você não possui permissão');
            } finally {
                const limpeza = await request(process.env.BASE_URL)
                    .delete(`/api/motorcycles/${idMoto}`)
                    .set('Authorization', `Bearer ${tokenGerente}`);
                //verifica se a exclusão foi feita com sucesso.
                if (limpeza.status !== 204) {
                    throw new Error(
                        `Falha ao limpar motocicleta ${idMoto}. `
                        + `Status: ${limpeza.status}`
                    );
                }
            }
        })
        it('Deve retornar 404 ao tentar atualizar uma motocicleta não encontrada', async () => {
            const bodyMotorcycles = { ...putMotorcycles };

            const resposta = await request(process.env.BASE_URL)
                .put(`/api/motorcycles/${idMotoInvalido}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenGerente}`)
                .send(bodyMotorcycles);

            expect(resposta.status).to.equal(404);
            expect(resposta.body).to.have.property(
                'error',
                'Motocicleta não encontrada.'
            );
        })

    })

})
