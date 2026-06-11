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