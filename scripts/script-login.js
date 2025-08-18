document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("msg");

  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    try {
      // busca os usuários do backend
      const res = await fetch("/usuarios");
      const usuarios = await res.json();

      const user = usuarios.find(u => u.email === email && u.senha === senha);

      if (user) {
        msg.innerHTML = `<div class="alert alert-success">✅ Login realizado com sucesso!</div>`;
        setTimeout(() => {
          window.location.href = "/home.html"; // rota certa do servidor
        }, 1500);
      } else {
        msg.innerHTML = `<div class="alert alert-danger">❌ Usuário ou senha inválidos</div>`;
      }

    } catch (err) {
      console.error(err);
      msg.innerHTML = `<div class="alert alert-warning">⚠️ Erro ao carregar usuários</div>`;
    }
  });
});
