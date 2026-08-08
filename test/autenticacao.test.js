const request = require('supertest');
const {expect} = require('chai');
require('dotenv').config();
const postAuthGerente = require ('./fixtures/postAuthGerente.json');
const postAuthUsuario = require ('./fixtures/postAuthUsuario.json');


describe('Autenticação', ()=>{
    describe ('POST /api/auth/login', ()=>{
        it('Deve retonar 200 com token em string quando usar credenciais válidas de Gerente', async()=>{
            const bodyAuth = {...postAuthGerente}
            const resposta = await request(process.env.BASE_URL)
                .post('/api/auth/login')
                .set('Content-Type','application/json')
                .send(bodyAuth)
            
                expect(resposta.status).to.equal(200);
                expect(resposta.body.token).to.be.a('string');
                expect(resposta.body.user.role).to.equal('manager');
        })
        it('Deve retonar 200 com token em string quando usar credenciais válidas de Usuário', async()=>{
            const bodyAuth = {...postAuthUsuario}
            const resposta = await request(process.env.BASE_URL)
                .post('/api/auth/login')
                .set('Content-Type','application/json')
                .send(bodyAuth)
            
                expect(resposta.status).to.equal(200);
                expect(resposta.body.token).to.be.a('string');
                expect(resposta.body.user.role).to.equal('user');
        })

    })
})