const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterTokenGerente, obterTokenUsuario } = require('./helpers/autenticacao');
const { criarMoto } = require('./helpers/criaMoto');
const { excluirMoto } = require('./helpers/excluirMoto');
const app = require('../src/app');
const motorcycleService = require('../src/services/motorcycleService');


describe('Get Motorcycles', () => {
    let tokenGerente;
    let tokenUsuario;
    const tokenInvalido = 'testes';
    const idMotoInvalido = '12354';

    before(async () => {
        tokenGerente = await obterTokenGerente();
        tokenUsuario = await obterTokenUsuario();
    })

    describe('GET/api/motorcycles', () => {

        it('Deve retornar 200 ao utilizar o token de gerente', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/api/motorcycles')
                .set('Authorization', `Bearer ${tokenGerente}`)

            //Validação com o CHAI
            expect(resposta.status).to.equal(200);
            expect(resposta.body.data).to.be.an('array');
            expect(resposta.body.data).to.not.be.empty;
            //count informado pela API = número de itens retornados em data
            expect(resposta.body.count).to.equal(resposta.body.data.length);
        })

        it('Deve retornar 200 ao utilizar o token de usuario', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/api/motorcycles')
                .set('Authorization', `Bearer ${tokenUsuario}`)

            //Validação com o CHAI
            expect(resposta.status).to.equal(200);
            expect(resposta.body.data).to.be.an('array');
            expect(resposta.body.data).to.not.be.empty;
            //count informado pela API = número de itens retornados em data
            expect(resposta.body.count).to.equal(resposta.body.data.length);
        })

        it('Deve retornar 401 ao realizar uma requisição com token inválido', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/api/motorcycles')
                .set('Authorization', `Bearer ${tokenInvalido}`)

            //Validação com o CHAI
            expect(resposta.status).to.equal(401);
            expect(resposta.body.error).to.include('Token inválido');

        })

        it('Deve retornar 500 quando ocorrer um problema no servidor', async () => {
            const listOriginal = motorcycleService.list;

            motorcycleService.list = () => {
                throw new Error('Erro interno simulado');
            };

            try {
                const resposta = await request(app)
                    .get('/api/motorcycles')
                    .set('Authorization', `Bearer ${tokenGerente}`);

                expect(resposta.status).to.equal(500);
                expect(resposta.body).to.have.property(
                    'error',
                    'Erro interno do servidor.'
                );
            } finally {
                motorcycleService.list = listOriginal;
            }
        })

    })
    describe('GET/api/motorcycles/{id}', () => {

        it.only('Deve retornar a moto ID filtrada e deve retornar status code 200', async () => {
            const motocicletaCriada = await criarMoto(tokenGerente);
            const idMoto = motocicletaCriada.id;

            try {
                const resposta = await request(process.env.BASE_URL)
                    .get(`/api/motorcycles/${idMoto}`)
                    .set('Authorization', `Bearer ${tokenGerente}`);

                //Validação com o CHAI
                expect(resposta.status).to.equal(200);
                expect(resposta.body.data.id).to.equal(idMoto);
                expect(resposta.body.data.brand).to.be.a('string');
                expect(resposta.body.data).to.have.property('createdAt');
            } finally {
                await excluirMoto(idMoto, tokenGerente);
            }

        })

        it('Deve retornar a moto ID filtrada com token de usuário e deve retornar status code 200', async () => {
            const motocicletaCriada = await criarMoto(tokenGerente);
            const idMoto = motocicletaCriada.id;

            try {
                const resposta = await request(process.env.BASE_URL)
                    .get(`/api/motorcycles/${idMoto}`)
                    .set('Authorization', `Bearer ${tokenUsuario}`);

                //Validação com o CHAI
                expect(resposta.status).to.equal(200);
                expect(resposta.body.data.id).to.equal(idMoto);
                expect(resposta.body.data.brand).to.be.a('string');
                expect(resposta.body.data).to.have.property('createdAt');
            } finally {
                await request(process.env.BASE_URL)
                    .delete(`/api/motorcycles/${idMoto}`)
                    .set('Authorization', `Bearer ${tokenGerente}`);
            }

        })

        it('Não deve retornar a moto ID filtrada e deve retornar status code 401', async () => {
            const motocicletaCriada = await criarMoto(tokenGerente);
            const idMoto = motocicletaCriada.id;

            try {
                const resposta = await request(process.env.BASE_URL)
                    .get(`/api/motorcycles/${idMoto}`)
                    .set('Authorization', `Bearer ${tokenInvalido}`);

                //Validação com o CHAI
                expect(resposta.status).to.equal(401);
                expect(resposta.body.error).to.include('Token inválido');
            } finally {
                await request(process.env.BASE_URL)
                    .delete(`/api/motorcycles/${idMoto}`)
                    .set('Authorization', `Bearer ${tokenGerente}`);
            }

        })

        it('Não deve retornar a moto ID Invalida e deve conter status code 404', async () => {

            const resposta = await request(process.env.BASE_URL)
                .get(`/api/motorcycles/${idMotoInvalido}`)
                .set('Authorization', `Bearer ${tokenGerente}`);


            //Validação com o CHAI
            expect(resposta.status).to.equal(404);
            expect(resposta.body.error).to.include('Motocicleta não encontrada');

        })

    })

})