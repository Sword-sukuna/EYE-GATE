// =========================
// 👁 EYE GATE LOGIN
// =========================


// =========================
// 🚀 INICIAR
// =========================
window.addEventListener(

  "DOMContentLoaded",

  ()=>{

    iniciarLogin();

  }

);


// =========================
// 🔐 INICIAR LOGIN
// =========================
function iniciarLogin(){

  const form =
    document.getElementById(
      "loginForm"
    );

  form.addEventListener(

    "submit",

    (e)=>{

      e.preventDefault();

      fazerLogin();

    }

  );

}


// =========================
// 🚪 LOGIN REAL
// =========================
function fazerLogin(){

  const email =
    document.getElementById("email").value.trim();

  const senha =
    document.getElementById("senha").value.trim();


  const usuarios =
    JSON.parse(
      localStorage.getItem("usuariosEyeGate")
    ) || [];


  const usuario =
    usuarios.find(
      u =>
        u.email === email &&
        u.senha === senha
    );


  // =====================
  // 👤 USUÁRIO NORMAL
  // =====================
  if(usuario){

    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify(usuario)
    );

    window.location.href =
      "./dashboard.html";

    return;

  }


  // =====================
  // 🔐 ADMIN
  // =====================
  const admin =
    JSON.parse(
      localStorage.getItem("adminEyeGate")
    );


  if(
    admin &&
    email === admin.email &&
    senha === admin.senha
  ){

    admin.tipo = "admin";

    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify(admin)
    );

    window.location.href =
      "./dashboard.html";

    return;

  }


  alert("Login inválido");

}


// =========================
// 🍞 TOAST
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