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

    const pagina =
document.getElementById(id);

console.log(
  "Tentando abrir:",
  id
);

console.log(
  "Elemento:",
  pagina
);

if(!pagina){
  console.error(
    "Página não encontrada:",
    id
  );
  return;
}

pagina.classList.add(
  "active-page"
);

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