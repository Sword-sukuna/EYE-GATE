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
// 🔐 LOGIN
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
// 🚪 LOGIN
// =========================
function fazerLogin(){

  const email =
    document
    .getElementById(
      "email"
    )
    .value
    .trim();

  const senha =
    document
    .getElementById(
      "senha"
    )
    .value
    .trim();


  // =====================
  // ⚠ CAMPOS
  // =====================
  if(

    !email ||
    !senha

  ){

    mostrarToast(
      "⚠ Preencha todos os campos"
    );

    return;

  }


  // =====================
  // 🔐 LOGIN FAKE
  // =====================
  // depois vamos ligar
  // com banco real

  if(

    email ===
    "admin@eyegate.com"

    &&

    senha ===
    "123456"

  ){

    mostrarToast(
      "✅ Login realizado"
    );

    setTimeout(()=>{

      window.location.href =
        "./dashboard.html";

    },1200);

  }else{

    mostrarToast(
      "❌ Email ou senha inválidos"
    );

  }

}


// =========================
// 🍞 TOAST
// =========================
function mostrarToast(texto){

  const toast =
    document.createElement(
      "div"
    );

  toast.className =
    "toast";

  toast.innerText =
    texto;

  document.body.appendChild(
    toast
  );


  setTimeout(()=>{

    toast.classList.add(
      "show"
    );

  },100);


  setTimeout(()=>{

    toast.classList.remove(
      "show"
    );

    setTimeout(()=>{

      toast.remove();

    },300);

  },2500);

}