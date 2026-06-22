// =========================
// 📊 STATS DO DASHBOARD (CORRIGIDO)
// =========================
async function carregarStats() {
    try {
        if (!window.supabaseClient) {
            console.error("❌ supabaseClient não encontrado");
            return;
        }

        const hoje = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Total de Alunos
        const { count: totalAlunos } = await window.supabaseClient
            .from("alunos")
            .select("*", { count: 'exact', head: true });

        // Total de Usuários
        const { count: totalUsers } = await window.supabaseClient
            .from("usuarios")
            .select("*", { count: 'exact', head: true });

        // Reconhecimentos HOJE (logs_reconhecimento)
        const { count: reconhecimentosHoje } = await window.supabaseClient
            .from("logs_reconhecimento")
            .select("*", { count: 'exact', head: true })
            .gte("horario", `${hoje}T00:00:00`);

        // Total de Registros HOJE
        const { count: registrosHoje } = await window.supabaseClient
            .from("logs_reconhecimento")
            .select("*", { count: 'exact', head: true })
            .gte("horario", `${hoje}T00:00:00`);

        // Atualiza os cards do Dashboard
        const elAlunos = document.getElementById("totalAlunos");
        const elUsers = document.getElementById("totalUsers");
        const elReconhecimentos = document.getElementById("totalReconhecimentos"); // ou "reconhecimentosHoje"
        const elRegistrosHoje = document.getElementById("registrosHoje");

        if (elAlunos) elAlunos.innerText = totalAlunos || 0;
        if (elUsers) elUsers.innerText = totalUsers || 0;
        if (elReconhecimentos) elReconhecimentos.innerText = reconhecimentosHoje || 0;
        if (elRegistrosHoje) elRegistrosHoje.innerText = registrosHoje || 0;

        console.log(`✅ Dashboard Stats atualizados | Hoje: ${reconhecimentosHoje} reconhecimentos`);

    } catch (e) {
        console.error("Erro ao carregar stats do dashboard:", e);
    }
}

// Expor globalmente
window.carregarStats = carregarStats;
