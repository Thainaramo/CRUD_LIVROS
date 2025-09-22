let _data = [];

function _validateNonEmpty(value, field) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${field} é obrigatório`);
  }
}

function _clone(item) {
  return { titulo: item.titulo, autor: item.autor };
}

function _norm(v) {
  return typeof v === 'string' ? v.trim() : '';
}

function _indexByTitulo(titulo) {
  const t = _norm(titulo);
  return _data.findIndex(item => item.titulo === t);
}

async function create({ titulo, autor } = {}) {
  _validateNonEmpty(titulo, 'titulo');
  _validateNonEmpty(autor, 'autor');
  const item = { titulo: _norm(titulo), autor: _norm(autor) };
  _data.push(item);
  return _clone(item);
}

async function list() {
  return _data.map(_clone);
}

async function findByTitulo(titulo) {
  if (typeof titulo !== 'string') return null;
  const idx = _indexByTitulo(titulo);
  if (idx === -1) return null;
  return _clone(_data[idx]);
}

async function update({ titulo, autor } = {}) {
  _validateNonEmpty(titulo, 'titulo');
  _validateNonEmpty(autor, 'autor');
  const idx = _indexByTitulo(titulo);
  if (idx === -1) return null;
  _data[idx] = { titulo: _data[idx].titulo, autor: _norm(autor) };
  return _clone(_data[idx]);
}

async function _reset() { _data = []; }

module.exports = { create, list, findByTitulo, update, _reset };
