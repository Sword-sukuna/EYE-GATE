
window.addEventListener("DOMContentLoaded", ()=>{

  document
    .getElementById("adminForm")
    .addEventListener("submit", loginAdmin);

});


// =========================
// 🔐 ADMIN FIXO (CÓDIGO)
// =========================
function loginAdmin(e){

  e.preventDefault();

  const email =
    document.getElementById("email").value.trim();

  const senha =
    document.getElementById("senha").value.trim();


  // =====================
  // 🔐 ADMIN FIXO
  // =====================
  const admin = {
    email: "Raul@ADM.local",
    senha: "Silvano@rosa10",
    tipo: "admin",
    nome: "Administrador"
  };


  // =====================
  // ✔ VERIFICAÇÃO
  // =====================
  if(email === admin.email && senha === admin.senha){

    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify(admin)
    );


    alert("Bem-vindo Admin!");

    window.location.href =
      "./dashboard.html";

  }else{

    alert("Acesso negado!");

  }

}