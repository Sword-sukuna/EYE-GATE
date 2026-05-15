// =========================
// 👁 DASHBOARD EYE GATE
// =========================


window.addEventListener("DOMContentLoaded", ()=>{

  carregarUsuario();
  carregarStats();
  verificarAdmin();

});


// =========================
// 🔐 PROTEÇÃO DE ACESSO
// =========================
(function protegerAcesso(){

  const user =
    JSON.parse(localStorage.getItem("usuarioLogado"));

  if(!user){
    window.location.href = "./login.html";
  }

})();


// =========================
// 👤 USUÁRIO
// =========================
function carregarUsuario(){

  const user =
    JSON.parse(localStorage.getItem("usuarioLogado"));

  if(!user) return;


  document.getElementById("userName").innerText = user.nome;

  document.getElementById("userType").innerText =
    user.tipo === "admin" ? "Administrador" : "Usuário";


  const avatar =
    document.querySelector(".user-avatar");


  if(user.foto){

    avatar.innerHTML = `
      <img src="${user.foto}"
        style="width:100%;height:100%;border-radius:50%;object-fit:cover;">
    `;

  }

}


// =========================
// 📊 STATS
// =========================
function carregarStats(){

  const users =
    JSON.parse(localStorage.getItem("usuariosEyeGate")) || [];

  document.getElementById("totalUsers").innerText =
    users.length;

}


// =========================
// 🔐 ADMIN CHECK (SEM AUTO OPEN)
// =========================
function verificarAdmin(){

  const user =
    JSON.parse(localStorage.getItem("usuarioLogado"));

  const panel =
    document.getElementById("adminPanel");

  if(!user || user.tipo !== "admin"){

    panel.style.display = "none";

    return;

  }

  // garante fechado ao iniciar
  panel.style.display = "none";

}


// =========================
// 🔐 TOGGLE ADMIN PANEL
// =========================
function toggleAdminPanel(){

  const user =
    JSON.parse(localStorage.getItem("usuarioLogado"));

  if(!user || user.tipo !== "admin"){

    alert("Acesso negado");

    return;

  }

  const panel =
    document.getElementById("adminPanel");

  if(panel.style.display === "block"){
    panel.style.display = "none";
  }else{
    panel.style.display = "block";
  }

}


// =========================
// 👥 LISTAR USERS (DEBUG)
// =========================
function listarUsuarios(){

  const users =
    JSON.parse(localStorage.getItem("usuariosEyeGate")) || [];

  console.log(users);

  alert("Usuários listados no console (F12)");

}


// =========================
// 🗑 GERENCIAR CONTAS (PROMPT SIMPLES)
// =========================
function abrirGerenciador(){

  const users =
    JSON.parse(localStorage.getItem("usuariosEyeGate")) || [];

  if(users.length === 0){
    alert("Nenhum usuário encontrado");
    return;
  }

  const lista =
    users.map((u,i)=>
      `${i} - ${u.nome} (${u.email})`
    ).join("\n");


  const index =
    prompt("Digite o número para deletar:\n\n" + lista);

  if(index === null) return;

  const i = Number(index);

  if(isNaN(i) || i < 0 || i >= users.length){
    alert("Índice inválido");
    return;
  }

  users.splice(i,1);

  localStorage.setItem(
    "usuariosEyeGate",
    JSON.stringify(users)
  );

  alert("Usuário removido!");

  location.reload();

}


// =========================
// ⚠ RESET SISTEMA
// =========================
function resetSistema(){

  if(confirm("Resetar TUDO?")){

    localStorage.clear();

    window.location.href = "./login.html";

  }

}


// =========================
// 🚪 LOGOUT
// =========================
function logout(){

  localStorage.removeItem("usuarioLogado");

  window.location.href = "./login.html";

}


function controlarPermissoes(){

  const user =
    JSON.parse(localStorage.getItem("usuarioLogado"));

  if(!user) return;

  if(user.tipo === "admin"){

    const adminLinks =
      document.querySelectorAll(".admin-only");

    adminLinks.forEach(el=>{
      el.style.display = "block";
    });

  }

}

window.addEventListener("DOMContentLoaded", ()=>{

  controlarPermissoes();

});