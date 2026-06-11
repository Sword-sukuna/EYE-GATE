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