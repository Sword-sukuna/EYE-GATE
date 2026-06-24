// =========================
// 📋 ADMIN LOGS (CORRIGIDO)
// =========================
async function carregarLogsAdmin() {
    const container = document.getElementById("adminLogs");
    if (!container) return;

    try {
        if (!window.supabaseClient) {
            console.error("supabaseClient não encontrado");
            return;
        }

        const { data, error } = await window.supabaseClient
            .from("logs_reconhecimento")
            .select("*")
            .order("horario", { ascending: false })
            .limit(100);

        if (error) {
            console.error("Erro ao carregar logs admin:", error);
            container.innerHTML = `<p style="color:red; text-align:center;">Erro ao carregar logs</p>`;
            return;
        }

        container.innerHTML = "";

        if (!data || data.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#aaa; padding:20px;">Nenhum registro encontrado</p>`;
            return;
        }

        data.forEach((log) => {
            const horario = new Date(log.horario).toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo"
            });

            container.innerHTML += `
                <div class="user-card">
                    <div class="info">
                        <strong>${log.nome_aluno || 'Desconhecido'}</strong>
                        <span>${log.status}</span>
                        <small>${horario}</small>
                    </div>
                    <button
                        class="delete-btn"
                        onclick="deletarLog('${log.id}')"
                    >
                        🗑 Excluir
                    </button>
                </div>
            `;
        });

        console.log(`✅ ${data.length} logs carregados no Admin`);

    } catch (e) {
        console.error("Erro geral no carregarLogsAdmin:", e);
    }
}

// =========================
// 🗑 DELETE LOG
// =========================
async function deletarLog(id) {
    if (!(await verificarAdminLocal?.())) {
        mostrarMensagem("Sem permissão");
        return;
    }

    if (!confirm("Tem certeza que deseja excluir este registro?")) return;

    try {
        const { error } = await window.supabaseClient
            .from("logs_reconhecimento")
            .delete()
            .eq("id", id);

        if (error) {
            console.error(error);
            mostrarMensagem("Erro ao excluir");
            return;
        }

        mostrarMensagem("Registro excluído com sucesso");
        
        // Atualiza as telas
        await carregarLogsAdmin();
        await carregarStats();
        await carregarGraficoLogs();
        await carregarLogs();

    } catch (err) {
        console.error("Erro ao deletar log:", err);
        mostrarMensagem("Erro ao excluir");
    }
}

// Expor funções globalmente
window.carregarLogsAdmin = carregarLogsAdmin;
window.deletarLog = deletarLog;