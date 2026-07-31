const motorcycleService = require('../services/motorcycleService');

function list(req, res, next) {
  try {
    const motorcycles = motorcycleService.list();
    return res.status(200).json({ data: motorcycles, count: motorcycles.length });
  } catch (error) {
    return next(error);
  }
}

function getById(req, res, next) {
  try {
    return res.status(200).json({ data: motorcycleService.getById(req.params.id) });
  } catch (error) {
    return next(error);
  }
}

function create(req, res, next) {
  try {
    return res.status(201).json({ data: motorcycleService.create(req.body) });
  } catch (error) {
    return next(error);
  }
}

function update(req, res, next) {
  try {
    return res.status(200).json({ data: motorcycleService.update(req.params.id, req.body) });
  } catch (error) {
    return next(error);
  }
}

function remove(req, res, next) {
  try {
    motorcycleService.remove(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = { list, getById, create, update, remove };
