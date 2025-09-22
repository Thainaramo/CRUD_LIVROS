const repo = require('./repo.memory');

test('createLivro deve criar e retornar o livro normalizado', async () => {
  const livro = await repo.create({ titulo: '  Dom Casmurro  ', autor: '  Machado de Assis  ' });
  expect(livro).toEqual({ titulo: 'Dom Casmurro', autor: 'Machado de Assis' });
});

test('createLivro deve rejeitar titulo vazio', async () => {
  await expect(repo.create({ titulo: '   ', autor: 'Autor' })).rejects.toThrow(/titulo/i);
});

test('createLivro deve rejeitar autor vazio', async () => {
  await expect(repo.create({ titulo: 'Livro', autor: '   ' })).rejects.toThrow(/autor/i);
});

// ---- READ ----
test('findByTitulo deve retornar livro existente', async () => {
  await repo._reset();
  await repo.create({ titulo: 'O Alienista', autor: 'Machado' });
  const achado = await repo.findByTitulo('O Alienista');
  expect(achado).toEqual({ titulo: 'O Alienista', autor: 'Machado' });
});

test('findByTitulo deve retornar null quando não existe', async () => {
  await repo._reset();
  await repo.create({ titulo: 'Memórias Póstumas', autor: 'Machado' });
  const achado = await repo.findByTitulo('Dom Casmurro');
  expect(achado).toBeNull();
});

// ---- UPDATE ----
test('updateLivro deve atualizar autor mantendo título', async () => {
  await repo._reset();
  await repo.create({ titulo: 'Quincas Borba', autor: 'Machado' });
  const atualizado = await repo.update({ titulo: 'Quincas Borba', autor: 'Machado de Assis' });
  expect(atualizado).toEqual({ titulo: 'Quincas Borba', autor: 'Machado de Assis' });
  const achado = await repo.findByTitulo('Quincas Borba');
  expect(achado).toEqual({ titulo: 'Quincas Borba', autor: 'Machado de Assis' });
});

test('updateLivro deve retornar null se livro não existir', async () => {
  await repo._reset();
  const atualizado = await repo.update({ titulo: 'Livro Inexistente', autor: 'Alguém' });
  expect(atualizado).toBeNull();
});

test('updateLivro deve rejeitar autor vazio', async () => {
  await repo._reset();
  await repo.create({ titulo: 'Capitu', autor: 'Machado' });
  await expect(repo.update({ titulo: 'Capitu', autor: '   ' })).rejects.toThrow(/autor/i);
});
