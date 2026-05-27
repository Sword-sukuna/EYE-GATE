// =========================
// 📄 TROCAR PÁGINA
// =========================
function abrirPagina(id){

  pararCameraCadastro();

  pararCameraMonitor();

  pararMonitor();

  mostrarLoading("Abrindo página...");

  setTimeout(()=>{

    if(

      id === "adminPage" &&

      !verificarAdminLocal()

    ){

      mostrarMensagem(
        "Acesso negado"
      );

      esconderLoading();

      return;

    }

    document
      .querySelectorAll(".page")
      .forEach(page => {

        page.classList.remove("active-page");

      });

    document
      .getElementById(id)
      .classList.add("active-page");

    esconderLoading();

    if(id === "cadastroPage"){

      iniciarCameraCadastro();

    }

    if(id === "monitorPage"){

      iniciarCameraMonitor();

      iniciarMonitor();

    }

  },500);

}

// =========================
// 🍞 TOAST
// =========================
function mostrarMensagem(texto){

  const toast =
    document.querySelector(".toast");

  if(!toast){

    alert(texto);

    return;

  }

  toast.innerText =
    texto;

  toast.classList.add("show");

  setTimeout(()=>{

    toast.classList.remove("show");

  },3000);

}

// =========================
// ⏳ LOADING SYSTEM
// =========================
function mostrarLoading(texto = "Carregando..."){

  const loading =
    document.getElementById(
      "loadingScreen"
    );

  const loadingText =
    document.getElementById(
      "loadingText"
    );

  if(!loading) return;

  loadingText.innerText =
    texto;

  loading.classList.add("show");

}

function esconderLoading(){

  const loading =
    document.getElementById(
      "loadingScreen"
    );

  if(!loading) return;

  loading.classList.remove("show");

}