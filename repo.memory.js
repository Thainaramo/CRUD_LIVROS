let _data = [];

// Valida se campo não é vazio
function _validateNonEmpty(value, field) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${field} é obrigatório`);
  }
}

// Cria cópia para não vazar referência interna
function _clone(item) {
  return { titulo: item.titulo, autor: item.autor };
}

// Normaliza para comparação (trim + lowercase)
function _norm(v) {
  return typeof v === 'string' ? v.trim().toLowerCase() : '';
}

// Busca índice do livro no array, ignorando maiúsculas/minúsculas
function _indexByTitulo(titulo) {
  const t = _norm(titulo);
  return _data.findIndex(item => _norm(item.titulo) === t);
}

// CREATE – mantém maiúsculas/minúsculas originais, só trim
async function create({ titulo, autor } = {}) {
  _validateNonEmpty(titulo, 'titulo');
  _validateNonEmpty(autor, 'autor');
  const item = { titulo: titulo.trim(), autor: autor.trim() };
  _data.push(item);
  return _clone(item);
}

// LIST – retorna cópia dos dados
async function list() {
  return _data.map(_clone);
}

// READ – busca por título (case-insensitive)
async function findByTitulo(titulo) {
  if (typeof titulo !== 'string') return null;
  const idx = _indexByTitulo(titulo);
  if (idx === -1) return null;
  return _clone(_data[idx]);
}

// UPDATE – atualiza autor, mantendo título original
async function update({ titulo, autor } = {}) {
  _validateNonEmpty(titulo, 'titulo');
  _validateNonEmpty(autor, 'autor');
  const idx = _indexByTitulo(titulo);
  if (idx === -1) return null;
  _data[idx] = { titulo: _data[idx].titulo, autor: autor.trim() };
  return _clone(_data[idx]);
}

// DELETE – só remove se título e autor baterem (comparação case-insensitive)
async function del({ titulo, autor } = {}) {
  _validateNonEmpty(titulo, 'titulo');
  _validateNonEmpty(autor, 'autor');
  const idx = _indexByTitulo(titulo);
  if (idx === -1) return false;
  if (_norm(_data[idx].autor) !== _norm(autor)) return false;
  _data.splice(idx, 1);
  return true;
}

// Reset do repositório (para testes)
async function _reset() { _data = []; }

module.exports = { create, list, findByTitulo, update, del, _reset };
