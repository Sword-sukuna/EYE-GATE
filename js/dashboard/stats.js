// =========================
// 📊 STATS DO DASHBOARD - VERSÃO FINAL
// =========================
async function carregarStats() {
    try {
        console.log("📊 Carregando estatísticas do Dashboard...");

        if (!window.supabaseClient) {
            console.warn("⚠️ supabaseClient não disponível no stats");
            return;
        }

        const hoje = new Date().toISOString().split('T')[0];

        // Buscando contagens
        const { count: totalAlunos } = await window.supabaseClient
            .from("alunos").select("*", { count: 'exact', head: true });

        const { count: totalUsers } = await window.supabaseClient
            .from("usuarios").select("*", { count: 'exact', head: true });

        const { count: reconhecimentosHoje } = await window.supabaseClient
            .from("logs_reconhecimento")
            .select("*", { count: 'exact', head: true })
            .gte("horario", `${hoje}T00:00:00`);

        // Atualiza os cards do Dashboard
        const totalAlunosEl = document.getElementById("totalAlunos");
        const totalUsersEl = document.getElementById("totalUsers");
        const totalReconhecimentosEl = document.getElementById("totalReconhecimentos");
        const registrosHojeEl = document.getElementById("registrosHoje");

        if (totalAlunosEl) totalAlunosEl.innerText = totalAlunos || 0;
        if (totalUsersEl) totalUsersEl.innerText = totalUsers || 0;
        if (totalReconhecimentosEl) totalReconhecimentosEl.innerText = reconhecimentosHoje || 0;
        if (registrosHojeEl) registrosHojeEl.innerText = reconhecimentosHoje || 0;

        console.log(`✅ Dashboard Stats atualizado | Hoje: ${reconhecimentosHoje} reconhecimentos`);

    } catch (e) {
        console.error("❌ Erro ao carregar stats do dashboard:", e);
    }
}

// Expor globalmente
window.carregarStats = carregarStats;