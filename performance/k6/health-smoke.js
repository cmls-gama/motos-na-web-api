import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,
    duration: '5s',
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<500'],
        checks: ['rate==1']
    }
};

const baseUrl = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
    const resposta = http.get(`${baseUrl}/health`);

    check(resposta, {
        'status code é 200': (response) => response.status === 200,
        'content-type é JSON': (response) =>
            response.headers['Content-Type']?.includes('application/json'),
        'body contém status ok': (response) =>
            response.json('status') === 'ok'
    });

    sleep(1);
}
