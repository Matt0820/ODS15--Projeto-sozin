const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Arquivos estáticos
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use("/images", express.static(path.join(__dirname, "images")));

// Funções JSON
const usuariosPath = path.join(__dirname, "dados", "usuarios.json");
function lerUsuarios() { return JSON.parse(fs.readFileSync(usuariosPath, "utf-8")); }
function salvarUsuarios(usuarios) { fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2)); }

// Rota raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "welcome.html"));
});

// Outras páginas
app.get("/home.html", (req, res) => res.sendFile(path.join(__dirname, "views", "homepage.html")));
app.get("/cadastro.html", (req, res) => res.sendFile(path.join(__dirname, "views", "cadastro.html")));
app.get("/perfil.html", (req, res) => res.sendFile(path.join(__dirname, "views", "perfil.html")));
app.get("/sobre.html", (req, res) => res.sendFile(path.join(__dirname, "views", "sobre.html")));
app.get("/acessibilidade.html", (req, res) => res.sendFile(path.join(__dirname, "views", "acessibilidade.html")));
app.get("/login.html" , (req, res) => res.sendFile(path.join(__dirname, "views", "login.html")))

// API usuários
app.get("/usuarios", (req, res) => res.json(lerUsuarios()));
app.post("/usuarios", (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ erro: "Preencha todos os campos!" });
  const usuarios = lerUsuarios();
  if (usuarios.some(u => u.email === email)) return res.status(400).json({ erro: "Email já cadastrado!" });
  usuarios.push({ nome, email, senha });
  salvarUsuarios(usuarios);
  res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
const spinnerHTML = fs.readFileSync(path.join(__dirname, 'views', 'spinner.html'), 'utf-8');

app.get('/homepage.html', (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, 'views', 'homepage.html'), 'utf-8');
  html = html.replace('<!-- SPINNER -->', spinnerHTML);
  res.send(html);
});
