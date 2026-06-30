// =========================
// 🚀 START - EYE-GATE (VERSÃO OTIMIZADA)
// =========================
window.addEventListener("DOMContentLoaded", async () => {
    console.log("[EYE-GATE] Sistema iniciado");

    try {
        // 1. Supabase
        await import('./core/supabase.js');

        // 2. Estrutura básica
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

        // 5. UI
        carregarUsuario();
        controlarPermissoes();

        // 6. Dados iniciais
        await Promise.all([
            carregarStats(),
            carregarGraficoLogs(),
            carregarLogs()
        ]);

        console.log("✅ Sistema carregado com sucesso");

        // 7. Iniciar monitor
        setTimeout(() => {
            iniciarMonitor();
        }, 1500);

    } catch (error) {
        console.error("💥 Erro na inicialização:", error);
    }
});

// Atualização automática mais leve
setInterval(async () => {
    try {
        await Promise.allSettled([
            carregarStats(),
            carregarGraficoLogs(),
            carregarLogs()
        ]);
    } catch (e) {}
}, 30000);