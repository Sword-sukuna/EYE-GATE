// =========================
// 🚀 START - EYE-GATE (VERSÃO OTIMIZADA)
// =========================
window.addEventListener("DOMContentLoaded", async () => {
    console.log("[TESTE] Sistema iniciado");

    try {
        // 1. Supabase (PRIMEIRO!)
        await import('./core/supabase.js');
        console.log("✅ Supabase carregado");

        // 2. Estrutura das páginas
        await carregarPaginas();

        // 3. Face API + Alunos + Matcher (uma única vez)
        await carregarFaceAPI();
        await carregarAlunosCache();
        await criarMatcher();

        // 4. Autenticações
        iniciarLogin();
        verificarSessao();
        iniciarAdminLogin();
        iniciarRegistro();
        iniciarCadastro();

        // 5. UI e permissões
        carregarUsuario();
        controlarPermissoes();

        // 6. Carregar dados iniciais (apenas uma vez)
        console.log("📊 Carregando dados iniciais...");
        await Promise.all([
            carregarStats(),
            carregarGraficoLogs(),
            carregarLogs(),
            carregarUsuarios?.()
        ]);

        console.log("✅ Sistema carregado com sucesso");

        // 7. Iniciar reconhecimento facial
        setTimeout(() => {
            iniciarMonitor();
            console.log("✅ Monitor de reconhecimento iniciado");
        }, 1500);

    } catch (error) {
        console.error("💥 Erro crítico durante inicialização:", error);
    }
});

// ====================== ATUALIZAÇÃO AUTOMÁTICA (OTIMIZADA) ======================
let ultimaAtualizacao = 0;

setInterval(async () => {
    const agora = Date.now();
    
    // Evita atualizações muito seguidas
    if (agora - ultimaAtualizacao < 25000) return; // mínimo 25s
    
    try {
        ultimaAtualizacao = agora;
        await Promise.allSettled([
            carregarStats(),
            carregarGraficoLogs(),
            carregarLogs()
        ]);
    } catch (e) {
        console.warn("⚠️ Erro na atualização automática:", e);
    }
}, 30000);