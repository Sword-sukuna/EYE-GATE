// =========================
// 📊 STATS DO DASHBOARD
// =========================
async function carregarStats() {
    try {
        console.log("📊 Carregando estatísticas do dashboard...");

        if (!window.supabaseClient) {
            console.warn("⚠️ supabaseClient não disponível");
            return;
        }

        const hoje = new Date().toISOString().split('T')[0];

        // Busca os totais
        const { count: totalAlunos } = await window.supabaseClient
            .from("alunos").select("*", { count: 'exact', head: true });

        const { count: totalUsers } = await window.supabaseClient
            .from("usuarios").select("*", { count: 'exact', head: true });

        const { count: reconhecimentosHoje } = await window.supabaseClient
            .from("logs_reconhecimento")
            .select("*", { count: 'exact', head: true })
            .gte("horario", `${hoje}T00:00:00`);

        // Atualiza os cards
        document.getElementById("totalAlunos")?.innerText = totalAlunos || 0;
        document.getElementById("totalUsers")?.innerText = totalUsers || 0;
        document.getElementById("totalReconhecimentos")?.innerText = reconhecimentosHoje || 0;
        document.getElementById("registrosHoje")?.innerText = reconhecimentosHoje || 0;

        console.log(`✅ Dashboard atualizado | Hoje: ${reconhecimentosHoje} reconhecimentos`);

    } catch (e) {
        console.error("❌ Erro ao carregar stats do dashboard:", e);
    }
}

// Expor globalmente
window.carregarStats = carregarStats;