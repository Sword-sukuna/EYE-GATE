// =========================
// 🚀 START - EYE-GATE
// =========================
window.addEventListener("DOMContentLoaded", async () => {
    console.log("[TESTE] Sistema iniciado");

    // 1. Supabase (primeiro!)
    await import('./core/supabase.js');
    console.log("✅ Supabase carregado");

    // 2. Carregar estrutura básica
    await carregarPaginas();

    // 3. Face API + Alunos + Matcher
    await carregarFaceAPI();
    await carregarAlunosCache();
    await criarMatcher();

    // 4. Autenticações
    iniciarLogin();
    verificarSessao();
    iniciarAdminLogin();
    iniciarRegistro();
    iniciarCadastro();

    // 5. Interface e dados
    carregarUsuario();
    controlarPermissoes();

    // 6. Carregar estatísticas e gráficos (depois das funções estarem definidas)
    await carregarStats();
    await carregarGraficoLogs();
    await carregarLogs();
    await carregarUsuarios();

    console.log("✅ Sistema carregado com sucesso");

    // 7. Iniciar reconhecimento facial
    setTimeout(() => {
        iniciarMonitor();
        console.log("✅ Sistema de reconhecimento iniciado com sucesso");
    }, 1500);
});

// Atualização automática (a cada 30 segundos)
setInterval(async () => {
    try {
        await carregarStats();
        await carregarGraficoLogs();
        await carregarLogs();
    } catch (e) {
        console.warn("Erro na atualização automática:", e);
    }
}, 30000);