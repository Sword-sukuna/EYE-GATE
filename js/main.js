// =========================
// 🚀 START - EYE-GATE (VERSÃO FINAL)
// =========================
window.addEventListener("DOMContentLoaded", async () => {
    console.log("[TESTE] Sistema iniciado");

    try {
        // 1. Supabase (PRIMEIRO!)
        await import('./core/supabase.js');
        console.log("✅ Supabase carregado");

        // 2. Carregar estrutura das páginas
        await carregarPaginas();

        // 3. Face API + Alunos + Matcher
        await carregarFaceAPI();
        await carregarAlunosCache();
        await criarMatcher();

        // 4. Autenticações e UI
        iniciarLogin();
        verificarSessao();
        iniciarAdminLogin();
        iniciarRegistro();
        iniciarCadastro();

        carregarUsuario();
        controlarPermissoes();

        // 5. Carregar dados do Dashboard e Registros
        await carregarStats();
        await carregarGraficoLogs();
        await carregarLogs();
        await carregarUsuarios?.(); // opcional com ? para evitar erro

        console.log("✅ Sistema carregado com sucesso");

        // 6. Iniciar monitoramento facial
        setTimeout(() => {
            iniciarMonitor();
            console.log("✅ Sistema de reconhecimento iniciado com sucesso");
        }, 1200);

    } catch (error) {
        console.error("💥 Erro crítico durante inicialização:", error);
    }
});

// ====================== ATUALIZAÇÃO AUTOMÁTICA ======================
setInterval(async () => {
    try {
        await carregarStats();
        await carregarGraficoLogs();
        await carregarLogs();
    } catch (e) {
        console.warn("⚠️ Erro na atualização automática:", e);
    }
}, 30000); // 30 segundos