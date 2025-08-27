const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const https = require("https");

const app = express();
const PORT = 3443; // porta HTTPS

app.use(express.json());

// Configurar sessão
app.use(session({
  secret: "chave-secreta-mvp",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // agora seguro porque HTTPS
}));

// Arquivos estáticos
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use("/images", express.static(path.join(__dirname, "images")));

// Funções JSON
const usuariosPath = path.join(__dirname, "dados", "usuarios.json");
function lerUsuarios() { return JSON.parse(fs.readFileSync(usuariosPath, "utf-8")); }
function salvarUsuarios(usuarios) { fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2)); }

// Middleware de autenticação
function verificarAutenticacao(req, res, next) {
  if (req.session && req.session.usuario) {
    next();
  } else {
    res.redirect("/login.html");
  }
}

// Rotas de páginas
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "views", "welcome.html")));
app.get("/home.html", verificarAutenticacao, (req, res) => res.sendFile(path.join(__dirname, "views", "homepage.html")));
app.get("/cadastro.html", (req, res) => res.sendFile(path.join(__dirname, "views", "cadastro.html")));
app.get("/perfil.html", verificarAutenticacao, (req, res) => res.sendFile(path.join(__dirname, "views", "perfil.html")));
app.get("/sobre.html", (req, res) => res.sendFile(path.join(__dirname, "views", "sobre.html")));
app.get("/acessibilidade.html", (req, res) => res.sendFile(path.join(__dirname, "views", "acessibilidade.html")));
app.get("/login.html", (req, res) => res.sendFile(path.join(__dirname, "views", "login.html")));

// API usuários
app.get("/usuarios", (req, res) => res.json(lerUsuarios()));

// Cadastro
app.post("/usuarios", (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ erro: "Preencha todos os campos!" });

  const usuarios = lerUsuarios();
  if (usuarios.some(u => u.email === email)) return res.status(400).json({ erro: "Email já cadastrado!" });

  usuarios.push({ nome, email, senha });
  salvarUsuarios(usuarios);
  res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
});

// Login
app.post("/login", (req, res) => {
  const { email, senha } = req.body;
  const usuarios = lerUsuarios();
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (!usuario) return res.status(401).json({ erro: "Usuário ou senha inválidos" });

  req.session.usuario = { nome: usuario.nome, email: usuario.email };
  res.json({ mensagem: "Login realizado com sucesso!" });
});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ mensagem: "Logout realizado com sucesso!" });
  });
});

// Spinner dinâmico
const spinnerHTML = fs.readFileSync(path.join(__dirname, "views", "spinner.html"), "utf-8");
app.get("/homepage.html", verificarAutenticacao, (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, "views", "homepage.html"), "utf-8");
  html = html.replace("<!-- SPINNER -->", spinnerHTML);
  res.send(html);
});

// Logs
const logErrosPath = path.join(__dirname, "logs", "erros.log");
app.post("/log-erro", (req, res) => {
  const { mensagem, url } = req.body;
  const timestamp = new Date().toISOString();
  const erro = `${timestamp} - ERRO: ${mensagem} na URL: ${url}\n`;

  fs.appendFile(logErrosPath, erro, (err) => {
    if (err) {
      console.error("Erro ao salvar log:", err);
      return res.status(500).json({ sucesso: false });
    }
    res.status(200).json({ sucesso: true });
  });
});

// HTTPS
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "certs/server.key")),
  cert: fs.readFileSync(path.join(__dirname, "certs/server.cert"))
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Servidor HTTPS rodando em https://localhost:${PORT}`);
});
