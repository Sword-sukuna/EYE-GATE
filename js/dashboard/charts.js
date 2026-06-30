// =========================
// 📈 GRÁFICO DE LOGS - VERSÃO ESTÁVEL
// =========================
async function carregarGraficoLogs() {
    const canvas = document.getElementById("graficoLogs");
    if (!canvas) {
        console.warn("Canvas do gráfico não encontrado");
        return;
    }

    try {
        // Destruir gráfico anterior
        if (window.graficoLogs instanceof Chart) {
            window.graficoLogs.destroy();
        }

        const { data, error } = await window.supabaseClient
            .from("logs_reconhecimento")
            .select("horario")
            .order("horario", { ascending: true });

        if (error || !data || data.length === 0) {
            console.log("Nenhum dado para o gráfico");
            return;
        }

        const dias = {};
        data.forEach(log => {
            const dia = new Date(log.horario).toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' });
            dias[dia] = (dias[dia] || 0) + 1;
        });

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
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: "#fff", font: { size: 14 } } }
                },
                scales: {
                    x: { ticks: { color: "#aaa" }, grid: { color: "rgba(255,255,255,0.05)" } },
                    y: { 
                        ticks: { color: "#aaa", stepSize: 1 }, 
                        grid: { color: "rgba(255,255,255,0.05)" },
                        beginAtZero: true 
                    }
                }
            }
        });

    } catch (e) {
        console.error("Erro no gráfico:", e);
    }
}

window.carregarGraficoLogs = carregarGraficoLogs;