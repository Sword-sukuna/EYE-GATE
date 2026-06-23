// =========================
// 📊 STATS DO DASHBOARD - VERSÃO LIMPA
// =========================
async function carregarStats() {
    try {
        console.log("📊 Carregando estatísticas...");

        if (!window.supabaseClient) {
            console.warn("supabaseClient não disponível");
            return;
        }

        const hoje = new Date().toISOString().split('T')[0];

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

        console.log(`✅ Stats carregados | Hoje: ${reconhecimentosHoje}`);

    } catch (e) {
        console.error("❌ Erro ao carregar stats:", e);
    }
}

window.carregarStats = carregarStats;