// =========================
// 🚀 START - EYE-GATE (LIMPO)
// =========================
window.addEventListener("DOMContentLoaded", async () => {
    console.log("[EYE-GATE] Sistema iniciado");

    try {
        await import('./core/supabase.js');

        await carregarPaginas();

        await carregarFaceAPI();
        await carregarAlunosCache();
        await criarMatcher();

        iniciarLogin();
        verificarSessao();
        iniciarAdminLogin();
        iniciarRegistro();
        iniciarCadastro();

        carregarUsuario();
        controlarPermissoes();

        await Promise.all([
            carregarStats(),
            carregarGraficoLogs(),
            carregarLogs()
        ]);

        console.log("✅ Sistema carregado com sucesso");

        setTimeout(() => iniciarMonitor(), 1500);

    } catch (error) {
        console.error("💥 Erro na inicialização:", error);
    }
});

// Atualização automática
setInterval(async () => {
    try {
        await Promise.allSettled([
            carregarStats(),
            carregarGraficoLogs(),
            carregarLogs()
        ]);
    } catch (e) {}
}, 30000);