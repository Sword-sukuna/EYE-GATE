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
    document
      .getElementById("email")
      .value
      .trim();

  const senha =
    document
      .getElementById("senha")
      .value
      .trim();


  // =====================
  // ⚠ VALIDAÇÃO
  // =====================
  if(!email || !senha){

    mostrarToast(
      "⚠ Preencha todos os campos"
    );

    return;

  }


  // =====================
  // 📦 PEGAR USUÁRIOS
  // =====================
  const usuarios =
    JSON.parse(
      localStorage.getItem("usuariosEyeGate")
    ) || [];


  // =====================
  // 🔎 PROCURAR USUÁRIO
  // =====================
  const usuario =
    usuarios.find(
      u =>
        u.email === email &&
        u.senha === senha
    );


  // =====================
  // ❌ ERRO
  // =====================
  if(!usuario){

    mostrarToast(
      "❌ Email ou senha inválidos"
    );

    return;

  }


  // =====================
  // ✅ LOGIN OK
  // =====================
  mostrarToast(
    `✅ Bem-vindo, ${usuario.nome}`
  );


  // =====================
  // 💾 SALVAR SESSÃO
  // =====================
  localStorage.setItem(
    "usuarioLogado",
    JSON.stringify(usuario)
  );


  // =====================
  // 🚀 REDIRECIONAR
  // =====================
  setTimeout(()=>{

    window.location.href =
      "./dashboard.html";

  },1200);

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