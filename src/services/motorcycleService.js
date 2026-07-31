const motorcycleModel = require('../models/motorcycleModel');
const AppError = require('./errors');

const allowedFields = ['brand', 'model', 'year', 'color', 'engineCapacityCc'];

function validateAndNormalize(payload, partial = false) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new AppError('O corpo da requisição deve ser um objeto JSON.', 400);
  }

  const unknownFields = Object.keys(payload).filter((field) => !allowedFields.includes(field));
  if (unknownFields.length) {
    throw new AppError(`Campos não permitidos: ${unknownFields.join(', ')}.`, 400);
  }

  if (partial && Object.keys(payload).length === 0) {
    throw new AppError('Informe ao menos um campo para atualização.', 400);
  }

  const missingFields = (partial ? [] : allowedFields).filter(
    (field) => payload[field] === undefined || payload[field] === null || payload[field] === '',
  );
  if (missingFields.length) {
    throw new AppError(`Campos obrigatórios ausentes: ${missingFields.join(', ')}.`, 400);
  }

  for (const field of ['brand', 'model', 'color']) {
    if (payload[field] !== undefined && (typeof payload[field] !== 'string' || !payload[field].trim())) {
      throw new AppError(`O campo ${field} deve ser um texto não vazio.`, 400);
    }
  }

  const maximumYear = new Date().getFullYear() + 1;
  if (
    payload.year !== undefined
    && (!Number.isInteger(payload.year) || payload.year < 1885 || payload.year > maximumYear)
  ) {
    throw new AppError(`O campo year deve ser um inteiro entre 1885 e ${maximumYear}.`, 400);
  }

  if (
    payload.engineCapacityCc !== undefined
    && (!Number.isInteger(payload.engineCapacityCc) || payload.engineCapacityCc <= 0)
  ) {
    throw new AppError('O campo engineCapacityCc deve ser um inteiro positivo.', 400);
  }

  return allowedFields.reduce((normalized, field) => {
    if (payload[field] !== undefined) {
      normalized[field] = typeof payload[field] === 'string' ? payload[field].trim() : payload[field];
    }
    return normalized;
  }, {});
}

function list() {
  return motorcycleModel.findAll();
}

function getById(id) {
  const motorcycle = motorcycleModel.findById(id);
  if (!motorcycle) throw new AppError('Motocicleta não encontrada.', 404);
  return motorcycle;
}

function create(payload) {
  return motorcycleModel.create(validateAndNormalize(payload));
}

function update(id, payload) {
  getById(id);
  return motorcycleModel.update(id, validateAndNormalize(payload, true));
}

function remove(id) {
  getById(id);
  motorcycleModel.remove(id);
}

module.exports = { list, getById, create, update, remove };
