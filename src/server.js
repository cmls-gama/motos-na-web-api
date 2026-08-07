const app = require('./app');
const motorcycleService = require('./services/motorcycleService');

const initialMotorcycles = [
  {
    brand: 'Yamaha',
    model: 'MT-03',
    year: 2025,
    color: 'Azul',
    engineCapacityCc: 321,
  },
  {
    brand: 'Honda',
    model: 'CB 500F',
    year: 2025,
    color: 'Vermelha',
    engineCapacityCc: 471,
  },
  {
    brand: 'BMW',
    model: 'G 310 R',
    year: 2025,
    color: 'Branca',
    engineCapacityCc: 313,
  },
  {
    brand: 'Bajaj',
    model: 'Dominar 400',
    year: 2025,
    color: 'Preta',
    engineCapacityCc: 373,
  },
  {
    brand: 'Royal Enfield',
    model: 'Himalayan 450',
    year: 2025,
    color: 'Cinza',
    engineCapacityCc: 452,
  },
  {
    brand: 'Suzuki',
    model: 'GSX-S750',
    year: 2025,
    color: 'Azul',
    engineCapacityCc: 749,
  },
  {
    brand: 'Zontes',
    model: 'R350',
    year: 2025,
    color: 'Preta',
    engineCapacityCc: 348,
  },
  {
    brand: 'SYM (Dafra)',
    model: 'NH 300',
    year: 2025,
    color: 'Vermelha',
    engineCapacityCc: 278,
  },
  {
    brand: 'Haojue',
    model: 'DR 160',
    year: 2025,
    color: 'Cinza',
    engineCapacityCc: 162,
  },
  {
    brand: 'CFMoto',
    model: '450NK',
    year: 2025,
    color: 'Branca',
    engineCapacityCc: 449,
  },
];

initialMotorcycles.forEach((motorcycle) => motorcycleService.create(motorcycle));

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`API disponível em http://localhost:${port}`);
  console.log(`Swagger disponível em http://localhost:${port}/api-docs`);
});
