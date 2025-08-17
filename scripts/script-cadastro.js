// Elementos do formulário
const form = document.getElementById('formCadastro');
const botaoCadastro = document.getElementById('botao-cadastro');
const inputNome = document.getElementById('inputNome');
const inputEmail = document.getElementById('exampleInputEmail1');
const confirmeEmail = document.getElementById('confirmeEmail');
const inputSenha = document.getElementById('inputSenha');
const confirmeSenha = document.getElementById('confirmeSenha');
const toggleSenha = document.getElementById('toggleSenha');
const requerimentos = document.getElementById('passwordRequirements');

// SVGs olho
const eyeSVG = toggleSenha.innerHTML;
const eyeSlashSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
  <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
  <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
</svg>
`;

// Toggle olho da senha
toggleSenha.addEventListener('click', () => {
  if (inputSenha.type === 'password') {
    inputSenha.type = 'text';
    toggleSenha.innerHTML = eyeSlashSVG;
  } else {
    inputSenha.type = 'password';
    toggleSenha.innerHTML = eyeSVG;
  }
});

// Mostrar/esconder requisitos da senha
inputSenha.addEventListener('focus', () => requerimentos.classList.add('visible'));
inputSenha.addEventListener('blur', () => requerimentos.classList.remove('visible'));

// Validar requisitos da senha dinamicamente
inputSenha.addEventListener('input', () => {
  const senha = inputSenha.value;
  const requisitos = [
    { regex: /.{8,}/, id: 'req-length' },
    { regex: /[A-Z]/, id: 'req-uppercase' },
    { regex: /[0-9]/, id: 'req-number' },
    { regex: /[!@#$%¨&*(),.:{}]/, id: 'req-symbol' },
  ];

  requisitos.forEach(r => {
    const el = document.getElementById(r.id);
    if (r.regex.test(senha)) {
      el.classList.add('text-success');
      el.classList.remove('text-danger');
    } else {
      el.classList.add('text-danger');
      el.classList.remove('text-success');
    }
  });
});

// Envio do formulário
botaoCadastro.addEventListener('click', async () => {
  const nome = inputNome.value.trim();
  const email = inputEmail.value.trim();
  const emailConf = confirmeEmail.value.trim();
  const senha = inputSenha.value;
  const senhaConf = confirmeSenha.value;

  // Validações básicas
  if (!nome || !email || !senha) { showToast('Preencha todos os campos!'); return; }
  if (email !== emailConf) { showToast('Os e-mails não coincidem!'); return; }
  if (senha !== senhaConf) { showToast('As senhas não coincidem!'); return; }

  // Valida requisitos da senha
  const tem8caracteres = senha.length >= 8;
  const temMaiuscula = /[A-Z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const temSimbolo = /[!@#$%¨&*(),.:{}]/.test(senha);

  if (!(tem8caracteres && temMaiuscula && temNumero && temSimbolo)) {
    showToast('Sua senha não atende a todos os requisitos.');
    return;
  }

  // Envia para o servidor
  try {
    const res = await fetch('/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });
    const data = await res.json();
    if (res.ok) {
      showToast(data.mensagem);
      window.location.href = '/home.html';
    } else {
      showToast(data.erro);
    }
  } catch (err) {
    console.error(err);
    showToast('Erro ao cadastrar. Tente novamente.');
  }
});
function showToast(mensagem,tipo = 'success') {
  const toast = document.getElementById('toastContainer');

  const toastEl = document.createElement('div');
  toastEl.className = 'toast align-items-center text-bg-${tipo} border-0';
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');

  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${mensagem}
      </div>
       <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
       </div>
       `;

  toast.appendChild(toastEl);

  const toastInstance = new bootstrap.Toast(toastEl);
  toastInstance.show();

  toastEl.addEventListener('click', () => toastInstance.remove());

} 
window.addEventListener('load', () => {
  document.getElementById('spinnerPage').style.display = 'none';
  document.getElementById('conteudoPage').classList.remove('d-none');
});