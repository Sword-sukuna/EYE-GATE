// =========================
// 📋 CARREGAR LOGS - VERSÃO FINAL
// =========================
async function carregarLogs() {
    const tabela = document.getElementById("logsTable");
    if (!tabela) {
        console.warn("Tabela de logs não encontrada");
        return;
    }

    try {
        if (!window.supabaseClient) {
            console.error("❌ supabaseClient não encontrado");
            return;
        }

        const { data, error } = await window.supabaseClient
            .from("logs_reconhecimento")
            .select("id, nome_aluno, status, horario")
            .order("horario", { ascending: false })
            .limit(100); // Limite para evitar sobrecarga

        if (error) {
            console.error("Erro ao carregar logs:", error);
            tabela.innerHTML = `<tr><td colspan="3" style="color:red; text-align:center;">Erro ao carregar logs</td></tr>`;
            return;
        }

        tabela.innerHTML = "";

        if (!data || data.length === 0) {
            tabela.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:30px; color:#aaa;">Nenhum registro encontrado ainda</td></tr>`;
            return;
        }

        data.forEach((log) => {
            const horario = new Date(log.horario).toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
                dateStyle: "short",
                timeStyle: "short"
            });

            tabela.innerHTML += `
                <tr>
                    <td><strong>${log.nome_aluno || 'Desconhecido'}</strong></td>
                    <td>${log.status}</td>
                    <td>${horario}</td>
                </tr>
            `;
        });

        console.log(`✅ ${data.length} logs carregados com sucesso`);

    } catch (e) {
        console.error("Erro geral em carregarLogs:", e);
        tabela.innerHTML = `<tr><td colspan="3" style="color:red; text-align:center;">Erro interno ao carregar logs</td></tr>`;
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
        else console.log(`✅ Logs antigos apagados com sucesso`);
    } catch (e) {
        console.error("Erro na limpeza de logs:", e);
    }
}

// ====================== AUTO LIMPEZA ======================
async function iniciarLimpezaDiaria() {
    await limparLogsAntigos();

    setInterval(async () => {
        const agora = new Date();
        if (agora.getHours() === 0 && agora.getMinutes() < 15) {
            await limparLogsAntigos();
        }
    }, 300000); // 5 minutos
}

// Expor globalmente
window.carregarLogs = carregarLogs;
window.iniciarLimpezaDiaria = iniciarLimpezaDiaria;