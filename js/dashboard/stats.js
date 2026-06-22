// =========================
// 📊 STATS DO DASHBOARD (CORRIGIDO)
// =========================
async function carregarStats() {
    try {
        if (!window.supabaseClient) return;

        const hoje = new Date().toISOString().split('T')[0];

        // Totais gerais
        const { count: totalAlunos } = await window.supabaseClient
            .from("alunos").select("*", { count: 'exact', head: true });

        const { count: totalUsers } = await window.supabaseClient
            .from("usuarios").select("*", { count: 'exact', head: true });

        // Hoje
        const { count: reconhecimentosHoje } = await window.supabaseClient
            .from("logs_reconhecimento")
            .select("*", { count: 'exact', head: true })
            .gte("horario", `${hoje}T00:00:00`);

        // Atualiza cards
        document.getElementById("totalAlunos")?.innerText = totalAlunos || 0;
        document.getElementById("totalUsers")?.innerText = totalUsers || 0;
        document.getElementById("totalReconhecimentos")?.innerText = reconhecimentosHoje || 0;
        document.getElementById("registrosHoje")?.innerText = reconhecimentosHoje || 0; // mesmo campo

        console.log(`✅ Dashboard atualizado | Hoje: ${reconhecimentosHoje} reconhecimentos`);

    } catch (e) {
        console.error("Erro ao carregar stats:", e);
    }
}

window.carregarStats = carregarStats;