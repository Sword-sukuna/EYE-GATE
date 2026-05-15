// =========================
// 👁 EYE GATE DASHBOARD
// =========================


// =========================
// 🚀 INICIAR
// =========================
window.addEventListener(

  "DOMContentLoaded",

  ()=>{

    carregarUsuario();

    atualizarStats();

  }

);


// =========================
// 👤 USUÁRIO LOGADO
// =========================
function carregarUsuario(){

  const usuario =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );


  if(!usuario){

    window.location.href =
      "./login.html";

    return;

  }


  // nome
  const nomeEl =
    document.querySelector(
      ".top-user strong"
    );


  if(nomeEl){

    nomeEl.innerText =
      usuario.nome;

  }


  // avatar
  const avatar =
    document.querySelector(
      ".user-avatar"
    );


  if(avatar){

    avatar.innerHTML =

      usuario.foto

      ?

      `<img
        src="${usuario.foto}"
        style="
          width:100%;
          height:100%;
          border-radius:50%;
          object-fit:cover;
        "
      />`

      :

      "👤";

  }

}


// =========================
// 📊 STATS (BÁSICO)
// =========================
function atualizarStats(){

  const alunos =
    JSON.parse(
      localStorage.getItem(
        "alunosEyeGate"
      )
    ) || [];


  const alunosEl =
    document.querySelectorAll(
      ".stat-card h2"
    );


  if(alunosEl[0]){

    alunosEl[0].innerText =
      alunos.length;

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