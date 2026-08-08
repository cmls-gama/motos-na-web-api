const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterTokenGerente, obterTokenUsuario } = require('./helpers/autenticacao');
const { criarMoto } = require('./helpers/criaMoto');
const app = require('../src/app');
const motorcycleService = require('../src/services/motorcycleService');

describe('Delete Motorcycles', () => {
    let tokenGerente;
    let tokenUsuario;
    const tokenInvalido = 'testes';
    const idMotoInvalido = '2342342';

    before(async () => {
        tokenGerente = await obterTokenGerente();
        tokenUsuario = await obterTokenUsuario();
    })

    describe('DELETE/api/motorcycles', () => {

        it('Deve retornar 204 ao utilizar o token de gerente para deletar', async () => {
            const motocicletaCriada = await criarMoto(tokenGerente);
            const idMoto = motocicletaCriada.id;

            const resposta = await request(process.env.BASE_URL)
                .delete(`/api/motorcycles/${idMoto}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenGerente}`)

            //Validação com o CHAI
            expect(resposta.status).to.equal(204);
            expect(resposta.body).to.be.empty;

        })

        it('Deve retornar 401 ao utilizar o token de invalido para deletar', async () => {
            const motocicletaCriada = await criarMoto(tokenGerente);
            const idMoto = motocicletaCriada.id;

            try {
                const resposta = await request(process.env.BASE_URL)
                    .delete(`/api/motorcycles/${idMoto}`)
                    .set('Content-Type', 'application/json')
                    .set('Authorization', `Bearer ${tokenInvalido}`)

                //Validação com o CHAI
                expect(resposta.status).to.equal(401);
                expect(resposta.body).to.deep.equal({error:'Token inválido ou expirado.'});

            } finally {
                //Deleta o registro criado para não sujar a memória
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

        it('Deve retornar 403 ao utilizar o token de usuario para deletar', async () => {
            const motocicletaCriada = await criarMoto(tokenGerente);
            const idMoto = motocicletaCriada.id;

            try {
                const resposta = await request(process.env.BASE_URL)
                    .delete(`/api/motorcycles/${idMoto}`)
                    .set('Content-Type', 'application/json')
                    .set('Authorization', `Bearer ${tokenUsuario}`)

                //Validação com o CHAI
                expect(resposta.status).to.equal(403);
                expect(resposta.body).to.deep.equal({error: 'Você não possui permissão para esta operação.'});

            } finally {
                //Deleta o registro criado para não sujar a memória
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
        it('Deve retornar 404 ao utilizar o token de gerente para deletar um id moto inválido', async () => {

            const resposta = await request(process.env.BASE_URL)
                .delete(`/api/motorcycles/${idMotoInvalido}`)
                .set('Authorization', `Bearer ${tokenGerente}`);

            expect(resposta.status).to.equal(404);
            expect(resposta.body).to.have.property('error','Motocicleta não encontrada.');

        })

        it('Deve retornar 500 quando ocorrer um erro interno ao deletar', async () => {
            const removeOriginal = motorcycleService.remove;

            motorcycleService.remove = () => {
                throw new Error('Erro interno simulado');
            };

            try {
                const resposta = await request(app)
                    .delete('/api/motorcycles/id-simulado')
                    .set('Authorization', `Bearer ${tokenGerente}`);

                expect(resposta.status).to.equal(500);
                expect(resposta.body).to.deep.equal({
                    error: 'Erro interno do servidor.'
                });
            } finally {
                motorcycleService.remove = removeOriginal;
            }
        });


    })

})
