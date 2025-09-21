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
