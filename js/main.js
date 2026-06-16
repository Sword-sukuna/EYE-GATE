// =========================
// 🚀 START
// =========================
window.addEventListener(

  "DOMContentLoaded",

  async ()=>{

    await carregarPaginas();

    await carregarFaceAPI();

    iniciarLogin();

    verificarSessao();

    await carregarFaceAPI();

    iniciarLogin();

    verificarSessao();

    iniciarAdminLogin();

    iniciarRegistro();

    iniciarCadastro();

    await carregarAlunosCache();

    carregarUsuario();

    controlarPermissoes();

    await carregarGraficoLogs();

    await carregarStats();

    await carregarUsuarios();

    await carregarLogs();

  }

);

setInterval(async ()=>{

  await carregarStats();

  await carregarLogs();

  await carregarGraficoLogs();

},30000);

