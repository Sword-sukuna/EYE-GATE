window.addEventListener("DOMContentLoaded", ()=>{

  document
    .getElementById("adminForm")
    .addEventListener("submit", loginAdmin);

});


function loginAdmin(e){

  e.preventDefault();

  const email =
    document.getElementById("email").value;

  const senha =
    document.getElementById("senha").value;


  const admin =
    JSON.parse(localStorage.getItem("adminEyeGate")) ||
    {
      email: "Raul@ADM.local",
      senha: "Silvano@rosa10",
      tipo: "admin"
    };


  if(email === admin.email && senha === admin.senha){

    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify(admin)
    );

    alert("Bem-vindo Admin!");

    window.location.href =
      "./dashboard.html";

  }else{

    alert("Acesso negado!");

  }

}