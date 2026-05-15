// =========================
// 👁 EYE GATE CONFIG
// =========================


// =========================
// 🚀 INICIAR
// =========================
window.addEventListener(

  "DOMContentLoaded",

  ()=>{

    iniciarAnimacoes();

    iniciarSwitches();

  }

);


// =========================
// ✨ ANIMAÇÕES
// =========================
function iniciarAnimacoes(){

  const cards =
    document.querySelectorAll(
      ".settings-card"
    );

  cards.forEach(

    (card,index)=>{

      card.style.opacity =
        "0";

      card.style.transform =
        "translateY(30px)";

      setTimeout(()=>{

        card.style.transition =
          ".5s ease";

        card.style.opacity =
          "1";

        card.style.transform =
          "translateY(0)";

      }, index * 120);

    }

  );

}


// =========================
// 🔘 SWITCHES
// =========================
function iniciarSwitches(){

  const switches =
    document.querySelectorAll(
      ".switch input"
    );

  switches.forEach(

    sw=>{

      sw.addEventListener(

        "change",

        ()=>{

          mostrarToast(

            sw.checked
            ?
            "✅ Opção ativada"
            :
            "❌ Opção desativada"

          );

        }

      );

    }

  );

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


// =========================
// 🚪 LOGOUT
// =========================
function logout(){

  window.location.href =
    "./index.html";

}