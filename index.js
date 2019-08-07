// adicionando as dependencia no express no arquivo
const express = require("express");

const server = express();

// definindo que o express deve ler json no body de uma reques
server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "name": "guilherme", "email": "guiotsu@gmail.com "}

const users = ["Guilherme", "Robson", "Giulia"];

// definindo um middleware global que vai ser chamado independete da rota
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}, URL: ${req.url}`);

  // o parametro next faz com que o middleware global nao trave a request feita pelo usuario
  next();

  console.timeEnd("Request");
});

// criando um middleware local para verificar se o usuario mandou um usuario dentro do body
function checkNameExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is requires" });
  }

  return next();
}

// middleware que verifica se o index passado no arrway de usuario existe
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }

  // toda a rota que utilizar essa rota vai ter acesso a essa variavel criada
  req.user = user;
  return next();
}

// rota que retorna todos os usuarios
server.get("/users", (req, res) => {
  return res.json(users);
});

// definindo o código http
server.get("/users/:index", checkUserInArray, (req, res) => {
  // const nome = res.query.nome; // consumindo Query params
  // const { index } = req.params; // consumindo route params
  // return res.json(users[index]);

  // acessando a variavel criada dentro do middlere checkUserInArray
  return res.json(req.user);
});

// rota de crição de usuario
server.post("/users", checkNameExists, (req, res) => {
  const { name } = req.body;
  users.push(name);

  return res.json(users);
});

// rota para edição de usuario
server.put("/users/:index", checkNameExists, checkUserInArray, (req, res) => {
  const { name } = req.body;
  const { index } = req.param;

  users[index] = name;

  return res.json(users);
});

// rota para deletar usuario
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.param;

  // splice percorre o vetor ate uma posição e delete n dados a partir dai
  users.splice(index, 1);

  return res.json(users);
});

// faz com que a rota escute na porta 3000 (localhost:3000)
server.listen(3000);
