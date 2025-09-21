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
