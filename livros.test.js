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

const { app } = require("./server");

let server, baseURL;

beforeAll(async () => {
  server = app.listen(0); // sobe a API em uma porta aleatória
  await new Promise((res) => server.once("listening", res));
  baseURL = `http://127.0.0.1:${server.address().port}`;
});

afterAll(async () => {
  await new Promise((res) => server.close(res));
});

// helper para requisições
const send = (method, path, body) =>
  fetch(`${baseURL}${path}`, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

const post = (titulo, autor) => send("POST", "/livros", { titulo, autor });
const del = (titulo, autor) => send("DELETE", "/livros", { titulo, autor });

// DELETE 
test("DELETE /livros → 204 ao remover; 404 na segunda", async () => {
  await post("Dom Casmurro", "Machado");
  expect((await del("Dom Casmurro", "Machado")).status).toBe(204); // removeu
  expect((await del("Dom Casmurro", "Machado")).status).toBe(404); // já não existe
});

test("DELETE /livros → 400 inválido; 404 não encontrado", async () => {
  expect((await del("", "Machado")).status).toBe(400); // título vazio
  expect((await del("Dom Casmurro", "")).status).toBe(400); // autor vazio
  expect((await del("Livro Inexistente", "Ninguém")).status).toBe(404); // não existe
});

test("DELETE /livros → deve falhar se título for com maiúsculas diferentes", async () => {
  await post("Dom Casmurro", "Machado");

  const res = await del("dom casmurro", "Machado"); // só muda o 'D' maiúsculo
  expect(res.status).toBe(204); // vai falhar: status real será 404
});

