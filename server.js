const express = require("express");
const app = express();

app.use(express.json());

const repo = require("./repo.memory");

// CREATE
app.post("/livros", async (req, res) => {
  try {
    const created = await repo.create(req.body || {});
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err?.message || "erro" });
  }
});

// READ (listar todos)
app.get("/livros", async (req, res) => {
  const all = await repo.list();
  res.status(200).json(all);
});

// READ (buscar por título)
app.get("/livros/:titulo", async (req, res) => {
  const achado = await repo.findByTitulo(req.params.titulo);
  if (!achado) return res.status(404).json({ error: "não encontrado" });
  res.status(200).json(achado);
});

// UPDATE
app.put("/livros", async (req, res) => {
  try {
    const atualizado = await repo.update(req.body || {});
    if (!atualizado) return res.status(404).json({ error: "não encontrado" });
    res.status(200).json(atualizado);
  } catch (err) {
    res.status(400).json({ error: err?.message || "erro" });
  }
});

// DELETE  
app.delete("/livros", async (req, res) => {
  try {
    const ok = await repo.del(req.body || {}); // vamos criar o método del no repo
    if (!ok) return res.status(404).json({ error: "não encontrado" });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err?.message || "erro" });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
  });
}

app.get("/", (req, res) => {
  res.send("API de livros rodando");
});

module.exports = { app };
