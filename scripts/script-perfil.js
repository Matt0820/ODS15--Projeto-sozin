document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/api/perfil");
        if (!response.ok) {
            window.location.href = "/login.html";
            return;
        }

        const data = await response.json();

        // **AQUI: Substitui o placeholder pelo nome dinâmico**
        document.getElementById("nomeUsuario").textContent = data.nome;
        document.getElementById("emailUsuario").textContent = data.email;

    } catch (error) {
        console.error("Erro ao carregar o perfil:", error);
    }
});