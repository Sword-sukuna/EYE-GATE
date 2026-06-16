async function carregarPaginas(){

  const paginas = [

    "login",
    "admin-login",
    "dashboard",
    "cadastro",
    "monitor",
    "registros",
    "relatorios",
    "admin"

  ];

  const app =
    document.getElementById("app");

  for(const pagina of paginas){

    const resposta =
      await fetch(
        `./pages/${pagina}.html`
      );

    app.innerHTML +=
      await resposta.text();

  }

}