botaoCadastro = document.getElementById("botao-cadastro");

botaoCadastro.addEventListener("click",function() {
    window.location.href = "cadastro.html";
})

botaoSobre = document.getElementById('botao-sobre');

botaoSobre.addEventListener('click',function() {
    window.location.href = "sobre.html";
})
window.addEventListener('load', () => {
  document.getElementById('spinnerPage').style.display = 'none';
  document.getElementById('conteudoPage').classList.remove('d-none');
});
