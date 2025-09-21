let _data = [];

function _validateNonEmpty(value, field) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${field} é obrigatório`);
  }
}

function _clone(item) {
  return { titulo: item.titulo, autor: item.autor };
}

async function create({ titulo, autor } = {}) {
  _validateNonEmpty(titulo, 'titulo');
  _validateNonEmpty(autor, 'autor');
  const item = { titulo: titulo.trim(), autor: autor.trim() };
  _data.push(item);
  return _clone(item);
}

async function list() {
  return _data.map(_clone);
}

async function _reset() { _data = []; }

module.exports = { create, list, _reset };
