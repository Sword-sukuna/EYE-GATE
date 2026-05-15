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
  // 🔎 BUSCA USUÁRIO OU ADMIN
  // =====================
  const usuario =
    usuarios.find(
      u =>
        u.email === email &&
        u.senha === senha
    );


  // =====================
  // ❌ INVÁLIDO
  // =====================
  if(!usuario){
    alert("Email ou senha inválidos");
    return;
  }


  // =====================
  // 🔐 LOGIN OK
  // =====================
  localStorage.setItem(
    "usuarioLogado",
    JSON.stringify(usuario)
  );


  alert("Login realizado com sucesso");


  window.location.href =
    "./dashboard.html";

}


// =========================
// 🍞 TOAST (opcional mantido)
// =========================
function mostrarToast(texto){

  const toast =
    document.createElement("div");

  toast.className = "toast";

  toast.innerText = texto;

  document.body.appendChild(toast);


  setTimeout(()=>{

    toast.classList.add("show");

  },100);


  setTimeout(()=>{

    toast.classList.remove("show");

    setTimeout(()=>{

      toast.remove();

    },300);

  },2500);

}