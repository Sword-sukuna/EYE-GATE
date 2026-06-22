// =========================
// 📋 CARREGAR LOGS (CORRIGIDO)
// =========================
async function carregarLogs() {
    const tabela = document.getElementById("logsTable");
    if (!tabela) return;

    try {
        if (!window.supabaseClient) {
            console.error("❌ supabaseClient não encontrado");
            return;
        }

        const { data, error } = await window.supabaseClient
            .from("logs_reconhecimento")
            .select("id, nome_aluno, status, horario")
            .order("horario", { ascending: false });

        if (error) {
            console.error("Erro ao carregar logs:", error);
            return;
        }

        tabela.innerHTML = "";

        if (data.length === 0) {
            tabela.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:20px;">Nenhum registro encontrado</td></tr>`;
            return;
        }

        data.forEach((log) => {
            const horario = new Date(log.horario).toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo"
            });

            tabela.innerHTML += `
                <tr>
                    <td>${log.nome_aluno || 'Desconhecido'}</td>
                    <td>${log.status}</td>
                    <td>${horario}</td>
                </tr>
            `;
        });

        console.log(`✅ ${data.length} logs carregados com sucesso`);

    } catch (e) {
        console.error("Erro geral em carregarLogs:", e);
    }
}

// =========================
// 🧹 LIMPAR LOGS ANTIGOS
// =========================
async function limparLogsAntigos() {
    try {
        const hoje = new Date().toLocaleDateString("sv-SE");

        const { error } = await window.supabaseClient
            .from("logs_reconhecimento")
            .delete()
            .lt("horario", `${hoje}T00:00:00`);

        if (error) console.error("Erro ao limpar logs antigos:", error);
        else console.log(`✅ Logs antigos apagados`);
    } catch (e) {
        console.error("Erro na limpeza:", e);
    }
}

// ====================== AUTO LIMPEZA ======================
async function iniciarLimpezaDiaria() {
    await limparLogsAntigos();

    setInterval(async () => {
        const agora = new Date();
        if (agora.getHours() === 0 && agora.getMinutes() < 10) {
            await limparLogsAntigos();
        }
    }, 300000);
}

// Expor funções globalmente
window.carregarLogs = carregarLogs;
window.iniciarLimpezaDiaria = iniciarLimpezaDiaria;