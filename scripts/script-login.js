document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("msg");

  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
      });

      const resultado = await res.json();

      if (res.ok) { // res.ok verifica se o status da resposta está entre 200-299
        msg.innerHTML = `<div class="alert alert-success">✅ ${resultado.mensagem}</div>`;
        setTimeout(() => {
          window.location.href = "/home.html"; // Redireciona para a página protegida
        }, 1500);
      } else {
        msg.innerHTML = `<div class="alert alert-danger">❌ ${resultado.erro}</div>`;
      }
    } catch (err) {
      console.error(err);
      msg.innerHTML = `<div class="alert alert-warning">⚠️ Erro ao tentar fazer login.</div>`;
    }
  });
});