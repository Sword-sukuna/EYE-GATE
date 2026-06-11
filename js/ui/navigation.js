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