import http from 'k6/http';
import { sleep, check } from 'k6';
import { obterTokenGerente } from '../helpers/authentication.js';
import { pegarBaseURL } from '../utils/variables.js';


export const options = {
    //aqui começa a config de testes de performance
   // iterations: 1,
    stages:[
    {duration: '10s', target:10}, // durante 10segundos coloque 10 usuários virtuais para executar meus testes
    {duration: '20s', target:10}, 
    {duration: '10s', target:30},//durante mais 10s coloque 30 usuários virtuais
    {duration: '20s', target:0},//nos 20 segundos finais devem zerar os usuários virtuais
  ],

  thresholds: {
    http_req_duration: ['p(90)<3000','max<5000'], // p90 menor que 3 segundos e duração máxima menor que 5 segundos
    http_req_failed: ['rate<0.01'],
    checks: ['rate==1']
  }
};

export default function () {
    const token = obterTokenGerente()

    const url = pegarBaseURL() + '/api/motorcycles';

    const payload = JSON.stringify({
        brand: "Honda",
        model: "CB 500F",
        year: 2025,
        color: "Vermelha",
        engineCapacityCc: 471
    });

    const params = {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
        },
    };

    const res = http.post(url,payload,params);

    //aqui são as validações(checagens) da performance
    check (res,{
        "Valida que o status é 201": (response) => response.status === 201,
        "Validar que o token é string": () => typeof token === 'string' && token.length > 0,
        "Resposta contém motocicleta criada": (response) => response.json('data.id') !== undefined
    });

    sleep(1);
}