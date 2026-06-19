// =========================
// 🚀 START - EYE-GATE
// =========================
window.addEventListener("DOMContentLoaded", async () => {
    console.log("[TESTE] Sistema iniciado");

    // 1. Carregar estrutura básica
    await carregarPaginas();
    
    // 2. Carregar Face API
    await carregarFaceAPI();
    
    // 3. Inicializar autenticações
    iniciarLogin();
    verificarSessao();
    iniciarAdminLogin();
    iniciarRegistro();
    iniciarCadastro();

    // 4. Carregar dados dos alunos e matcher
    await carregarAlunosCache();
    await criarMatcher();

    // 5. Carregar interface do usuário
    carregarUsuario();
    controlarPermissoes();
    await carregarGraficoLogs();
    await carregarStats();
    await carregarUsuarios();
    await carregarLogs();

    // 6. Iniciar reconhecimento facial (só uma vez!)
    setTimeout(() => {
        iniciarMonitor();
        console.log("✅ Sistema de reconhecimento iniciado com sucesso");
    }, 1800);
});

// Atualização automática de estatísticas (a cada 30 segundos)
setInterval(async () => {
    await carregarStats();
    await carregarLogs();
    await carregarGraficoLogs();
}, 30000);