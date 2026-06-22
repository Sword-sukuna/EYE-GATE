// =========================
// 📈 GRAFICO LOGS (CORRIGIDO)
// =========================
async function carregarGraficoLogs() {
    const canvas = document.getElementById("graficoLogs");
    if (!canvas) return;

    try {
        const { data, error } = await window.supabaseClient
            .from("logs_reconhecimento")
            .select("horario")
            .order("horario", { ascending: true });

        if (error) {
            console.error("Erro ao carregar gráfico:", error);
            return;
        }

        const dias = {};
        data.forEach(log => {
            const dia = new Date(log.horario).toLocaleDateString("pt-BR");
            dias[dia] = (dias[dia] || 0) + 1;
        });

        // Destruir gráfico antigo se existir
        if (window.graficoLogs) {
            window.graficoLogs.destroy();
        }

        window.graficoLogs = new Chart(canvas, {
            type: "line",
            data: {
                labels: Object.keys(dias),
                datasets: [{
                    label: "Reconhecimentos",
                    data: Object.values(dias),
                    borderColor: "#6C5CE7",
                    backgroundColor: "rgba(108,92,231,0.2)",
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: "#fff" } }
                },
                scales: {
                    x: { ticks: { color: "#aaa" }, grid: { color: "rgba(255,255,255,0.05)" } },
                    y: { ticks: { color: "#aaa" }, grid: { color: "rgba(255,255,255,0.05)" } }
                }
            }
        });

    } catch (e) {
        console.error("Erro no gráfico:", e);
    }
}

window.carregarGraficoLogs = carregarGraficoLogs;