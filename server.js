const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS
const corsOptions = {
  origin: [
    "https://meubolso-frontend.vercel.app",
    "https://humble-eureka-jj5x579qr457fpwv6-8080.app.github.dev/"
  ],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
};

app.use(cors(corsOptions));

// Banco de dados fictício
let gastos = [
  {
    id: 1,
    descricao: "Mercado",
    valor: 150.00,
    categoria: "Alimentação",
    data: "2026-05-11"
  },
  {
    id: 2,
    descricao: "Internet",
    valor: 99.90,
    categoria: "Casa",
    data: "2026-05-10"
  }
];

// ROTA BASE
app.get("/", (req, res) => {
  res.json({
    status: "Backend MeuBolso rodando 🚀",
    versao: "1.1.0",
    cors_ativo: true
  });
});

// ROTA V1
app.get("/v1", (req, res) => {
  res.json({
    message: "Api v1 respondendo no container docker...",
    chamada_em: new Date().toLocaleString("pt-BR")
  });
});

// GET: listar gastos
app.get("/gastos", (req, res) => {
  res.json({
    mensagem: "Gastos carregados",
    total: gastos.length,
    gastos: gastos
  });
});

// GET: gasto por ID
app.get("/gastos/:id", (req, res) => {

  const gasto = gastos.find(g => g.id == req.params.id);

  if (!gasto) {
    return res.status(404).json({
      erro: "Gasto não encontrado"
    });
  }

  res.json(gasto);
});

// POST: criar gasto
app.post("/gastos", (req, res) => {

  const { descricao, valor, categoria } = req.body;

  if (!descricao || !valor) {
    return res.status(400).json({
      erro: "Descrição e valor são obrigatórios"
    });
  }

  const novoGasto = {
    id: gastos.length > 0
      ? Math.max(...gastos.map(g => g.id)) + 1
      : 1,

    descricao,
    valor,
    categoria: categoria || "Geral",
    data: new Date().toISOString().split("T")[0]
  };

  gastos.push(novoGasto);

  res.status(201).json({
    mensagem: "Gasto criado",
    gasto: novoGasto
  });
});

// DELETE: remover gasto
app.delete("/gastos/:id", (req, res) => {

  const id = Number(req.params.id);

  gastos = gastos.filter(g => g.id !== id);

  res.json({
    mensagem: "Gasto removido"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});