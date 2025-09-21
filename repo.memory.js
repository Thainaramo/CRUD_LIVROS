// Repositório em memória (fase Refactor)
// Responsabilidades:
//  - Guardar livros em um array interno
//  - Validar campos obrigatórios
//  - Expor operações create, list e _reset (para testes)

let _data = [];

// --- utils ---
function _validateNonEmpty(value, field) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${field} é obrigatório`);
  }
}

function _clone(item) {
  return { titulo: item.titulo, autor: item.autor };
}

// --- operações públicas ---
async function create({ titulo, autor } = {}) {
  _validateNonEmpty(titulo, 'titulo');
  _validateNonEmpty(autor, 'autor');
  const item = { titulo: titulo.trim(), autor: autor.trim() };
  _data.push(item);
  return _clone(item); // retorna cópia
}

async function list() {
  return _data.map(_clone); // nunca retornamos referência direta
}

async function _reset() { _data = []; }

module.exports = { create, list, _reset };
