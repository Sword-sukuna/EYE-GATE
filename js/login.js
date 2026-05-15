
// =========================
// 👁 EYE GATE LOGIN
// =========================

window.addEventListener("DOMContentLoaded", ()=>{

  iniciarLogin();

});


// =========================
// 🔐 INICIAR LOGIN
// =========================
function iniciarLogin(){

  const form =
    document.getElementById("loginForm");

  form.addEventListener("submit", (e)=>{

    e.preventDefault();

    fazerLogin();

  });

}


// =========================
// 🚪 LOGIN REAL (CORRIGIDO)
// =========================
function fazerLogin(){

  const email =
    document.getElementById("email").value.trim();

  const senha =
    document.getElementById("senha").value.trim();


  if(!email || !senha){
    alert("Preencha todos os campos");
    return;
  }


  const usuarios =
    JSON.parse(localStorage.getItem("usuariosEyeGate")) || [];


  // =====================
  // 🔎 USUÁRIO NORMAL
  // =====================
  const usuario =
    usuarios.find(
      u =>
        u.email === email &&
        u.senha === senha &&
        u.tipo !== "admin"
    );


  // =====================
  // 🔐 ADMIN FIXO (GARANTIDO)
  // =====================
  const adminFix = {
    email: "Raul@ADM.local",
    senha: "Silvano@rosa10",
    tipo: "admin",
    nome: "Administrador"
  };


  // =====================
  // ✔ LOGIN ADMIN
  // =====================
  if(email === adminFix.email && senha === adminFix.senha){

    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify(adminFix)
    );

    alert("Bem-vindo Admin!");

    window.location.href = "./dashboard.html";

    return;
  }


  // =====================
  // ✔ LOGIN USUÁRIO
  // =====================
  if(usuario){

    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify(usuario)
    );

    alert("Login realizado com sucesso");

    window.location.href = "./dashboard.html";

    return;
  }


  // =====================
  // ❌ INVÁLIDO
  // =====================
  alert("Email ou senha inválidos");

}