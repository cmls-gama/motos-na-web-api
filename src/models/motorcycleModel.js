const { randomUUID } = require('node:crypto');

const motorcycles = new Map();

function findAll() {
  return Array.from(motorcycles.values());
}

function findById(id) {
  return motorcycles.get(id) || null;
}

function create(data) {
  const now = new Date().toISOString();
  const motorcycle = {
    id: randomUUID(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  motorcycles.set(motorcycle.id, motorcycle);
  return motorcycle;
}

function update(id, data) {
  const current = motorcycles.get(id);
  if (!current) return null;

  const motorcycle = {
    ...current,
    ...data,
    id,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  };
  motorcycles.set(id, motorcycle);
  return motorcycle;
}

function remove(id) {
  return motorcycles.delete(id);
}

function clear() {
  motorcycles.clear();
}

module.exports = { findAll, findById, create, update, remove, clear };
