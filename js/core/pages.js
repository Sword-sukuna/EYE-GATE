async function carregarPaginas() {

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

  const app = document.getElementById("app");

  app.innerHTML = "";

  for (const pagina of paginas) {

    const resposta =
      await fetch(`./pages/${pagina}.html`);

    const html =
      await resposta.text();

    app.insertAdjacentHTML(
      "beforeend",
      html
    );

  }

  lucide.createIcons();

}