// =========================
// 👁 EYE GATE LOGIN
// =========================


// =========================
// 📦 ELEMENTOS
// =========================
const loginForm =
document.getElementById(
  "loginForm"
);

const emailInput =
document.getElementById(
  "email"
);

const passwordInput =
document.getElementById(
  "password"
);

const errorMessage =
document.getElementById(
  "errorMessage"
);


// =========================
// 🔐 LOGIN
// =========================
loginForm.addEventListener(

  "submit",

  (e)=>{

    e.preventDefault();


    const email =
    emailInput.value.trim();

    const senha =
    passwordInput.value.trim();


    // =====================
    // ⚠ CAMPOS
    // =====================
    if(

      !email ||
      !senha

    ){

      mostrarErro(
        "Preencha todos os campos"
      );

      return;

    }


    // =====================
    // 👨 ADMIN PADRÃO
    // =====================
    if(

      email ===
      "admin@eyegate.com"

      &&

      senha ===
      "123456"

    ){

      // salva login
      localStorage.setItem(
        "eye_gate_login",
        "true"
      );


      localStorage.setItem(
        "eye_gate_user",
        JSON.stringify({

          nome:
          "Administrador",

          email:
          email,

          cargo:
          "admin"

        })
      );


      // loading fake
      mostrarErro(
        "Entrando..."
      );


      setTimeout(()=>{

        location.href =
        "./dashboard.html";

      },1200);

    }else{

      mostrarErro(
        "Email ou senha inválidos"
      );

    }

  }

);


// =========================
// ⚠ MOSTRAR ERRO
// =========================
function mostrarErro(texto){

  errorMessage.innerText =
  texto;

}



// =========================
// 🔒 AUTO LOGIN
// =========================
const jaLogado =
localStorage.getItem(
  "eye_gate_login"
);

if(jaLogado){

  location.href =
  "./dashboard.html";

}