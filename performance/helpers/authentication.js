import http from 'k6/http';
import { check } from 'k6';
import { pegarBaseURL } from '../utils/variables.js';
const postAuthGerente = JSON.parse(open('../../test/fixtures/postAuthGerente.json'));

export function obterTokenGerente (){
    const url = pegarBaseURL() + '/api/auth/login';

    const payload = JSON.stringify(postAuthGerente);

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'Login retornou status 200': (response) => response.status === 200,
        'Token retornado é uma string': (response) => typeof response.json('token') === 'string'
    });

    return res.json('token');
}