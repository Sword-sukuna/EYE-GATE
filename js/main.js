// =========================
// 🚀 START
// =========================
window.addEventListener("DOMContentLoaded", async () => {
    await carregarPaginas();
    await carregarFaceAPI();
    iniciarLogin();
    verificarSessao();
    iniciarAdminLogin();
    iniciarRegistro();
    iniciarCadastro();

    await carregarAlunosCache();
    await criarMatcher();           // ← Adicionar isso

    carregarUsuario();
    controlarPermissoes();
    await carregarGraficoLogs();
    await carregarStats();
    await carregarUsuarios();
    await carregarLogs();

    // ←←← IMPORTANTE
    setTimeout(() => {
        iniciarMonitor();           // ← Inicia o reconhecimento
        console.log("✅ Monitor de reconhecimento iniciado");
    }, 2000);
});

setInterval(async ()=>{

  await carregarStats();

  await carregarLogs();

  await carregarGraficoLogs();

},30000);

    // === INICIALIZAÇÃO DO RECONHECIMENTO ===
    await carregarAlunosCache();
    await criarMatcher();
    
    setTimeout(() => {
        iniciarMonitor();
        console.log("✅ Sistema de reconhecimento iniciado");
    }, 2000);