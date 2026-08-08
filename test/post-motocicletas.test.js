const request = require('supertest');
const {expect} = require('chai');
require('dotenv').config();
const postMotorcycles = require ('./fixtures/postMotorcycles.json');
const { obterTokenGerente, obterTokenUsuario } = require('./helpers/autenticacao');
const app = require('../src/app');
const motorcycleService = require('../src/services/motorcycleService');


describe ('Crud de Motocicletas', ()=> {
    let tokenGerente;
    let tokenUsuario;
    let tokenInvalido = 'testes';

    before(async()=>{
        tokenGerente = await obterTokenGerente();
        tokenUsuario = await obterTokenUsuario();
    })

    describe ('POST/api/motorcycles', ()=>{

        it('Deve retornar 201 ao utilizar o token de gerente', async()=>{
            const bodyMotorcycles = {...postMotorcycles}

            const resposta = await request(process.env.BASE_URL)
                .post('/api/motorcycles')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenGerente}`)
                .send(bodyMotorcycles)


            //Validações com o CHAI
            expect(resposta.status).to.be.equal(201);
            expect(resposta.body.data.id).to.be.a('string');
            expect(resposta.body.data.brand).to.be.equal('Honda');
            expect(resposta.body.data).to.have.property('createdAt');
        })

        it('Deve retornar 400 ao realizar uma requisição inválida', async()=>{
            const bodyMotorcycles = {...postMotorcycles}

            //Deixando o body da request inválido para causar o status code 400
            delete bodyMotorcycles.brand;

            const resposta = await request(process.env.BASE_URL)
                .post('/api/motorcycles')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenGerente}`)
                .send(bodyMotorcycles)


            //Validações com o CHAI
            expect(resposta.status).to.be.equal(400);
            expect(resposta.body.error).to.include('Campos obrigatórios ausentes: brand');
            
        })

        it('Deve retornar 401 ao realizar uma requisição com token inválido', async()=>{
            const bodyMotorcycles = {...postMotorcycles}

            const resposta = await request(process.env.BASE_URL)
                .post('/api/motorcycles')
                .set('Content-Type', 'appliation/json')
                .set('Authorization', `Bearer ${tokenInvalido}`)
                .send(bodyMotorcycles)


            //Validações com o CHAI
            expect(resposta.status).to.be.equal(401);
            
        })

        it('Deve retornar 403 ao realizar uma requisição post com token de usuário', async()=>{
            const bodyMotorcycles = {...postMotorcycles}

            const resposta = await request(process.env.BASE_URL)
                .post('/api/motorcycles')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenUsuario}`)
                .send(bodyMotorcycles)

            //Validações com o CHAI
            expect(resposta.status).to.be.equal(403);
            // Verifica se contém determinado trecho
            expect(resposta.body.error).to.include('Você não possui permissão');
        })

        it('Deve retornar 500 quando ocorrer um problema no servidor', async () => {
            const bodyMotorcycles = { ...postMotorcycles };
            const createOriginal = motorcycleService.create;

            //Simula temporariamente uma função que lança um erro inesperado:
            motorcycleService.create = () => {
                throw new Error('Erro interno simulado');
            };

            try {
                const resposta = await request(app)
                    .post('/api/motorcycles')
                    .set('Content-Type', 'application/json')
                    .set('Authorization', `Bearer ${tokenGerente}`)
                    .send(bodyMotorcycles);

                expect(resposta.status).to.equal(500);
                expect(resposta.body).to.have.property('error','Erro interno do servidor.');
            //O finally sempre é executado, mesmo se a requisição ou uma asserção falhar. Isso garante que o método original seja restaurado
            } finally {
                motorcycleService.create = createOriginal;
            }
        })
    })

})