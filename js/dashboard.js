// =========================
// 👁 EYE GATE DASHBOARD
// =========================


// =========================
// 🚀 INICIAR
// =========================
window.addEventListener(

  "DOMContentLoaded",

  ()=>{

    verificarLogin();

    carregarUsuario();

    iniciarDashboard();

  }

);


// =========================
// 🔐 VERIFICAR LOGIN
// =========================
function verificarLogin(){

  const usuario =
    localStorage.getItem(
      "usuarioLogado"
    );

  // sem login
  if(!usuario){

    window.location.href =
      "./login.html";

  }

}


// =========================
// 👤 CARREGAR USER
// =========================
function carregarUsuario(){

  const usuario =
    JSON.parse(

      localStorage.getItem(
        "usuarioLogado"
      )

    );

  // sem user
  if(!usuario) return;


  // nome
  const nomeBox =
    document.querySelector(
      ".top-user strong"
    );

  if(nomeBox){

    nomeBox.innerText =
      usuario.nome;

  }

}


// =========================
// 📊 DASHBOARD
// =========================
function iniciarDashboard(){

  atualizarHorario();

  setInterval(

    atualizarHorario,

    1000

  );

}


// =========================
// 🕒 HORÁRIO
// =========================
function atualizarHorario(){

  const agora =
    new Date();

  const hora =
    agora.toLocaleTimeString(
      "pt-BR"
    );

  const atividade =
    document.querySelector(
      ".activity-item span"
    );

  if(atividade){

    atividade.innerText =
      hora;

  }

}


// =========================
// 🚪 LOGOUT
// =========================
function logout(){

  localStorage.removeItem(
    "usuarioLogado"
  );

  window.location.href =
    "./login.html";

}