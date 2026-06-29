// =========================
// 📋 ADMIN LOGS (COMPLETO E CORRIGIDO)
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

        // Botão de limpar todo histórico (só admin)
        const btnLimpar = document.createElement("button");
        btnLimpar.className = "delete-all-btn";
        btnLimpar.innerHTML = "🗑 Limpar Todo Histórico";
        btnLimpar.style.marginTop = "20px";
        btnLimpar.style.background = "#e74c3c";
        btnLimpar.onclick = limparTodoHistorico;
        container.appendChild(btnLimpar);

        console.log(`✅ ${data.length} logs carregados no Admin`);

    } catch (e) {
        console.error("Erro geral no carregarLogsAdmin:", e);
    }
}

// =========================
// 🗑 DELETAR LOG INDIVIDUAL
// =========================
async function deletarLog(id) {
    if (!confirm("Excluir este registro?")) return;

    if (!await verificarAdminLocal()) {
        mostrarMensagem("Sem permissão");
        return;
    }

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

        mostrarMensagem("Registro excluído");
        await carregarLogsAdmin();
        await carregarStats();
        await carregarGraficoLogs();

    } catch (err) {
        console.error("Erro ao deletar log:", err);
    }
}

// =========================
// 🗑 LIMPAR TODO HISTÓRICO
// =========================
async function limparTodoHistorico() {
    if (!confirm("⚠️ APAGAR TODO o histórico de entrada e saída?\nEssa ação não pode ser desfeita!")) {
        return;
    }

    if (!await verificarAdminLocal()) {
        mostrarMensagem("Apenas administradores podem fazer isso.");
        return;
    }

    try {
        const { error } = await window.supabaseClient
            .from("logs_reconhecimento")
            .delete()
            .gt("id", 0); // Deleta todos

        if (error) {
            console.error(error);
            mostrarMensagem("Erro ao limpar histórico");
            return;
        }

        mostrarMensagem("✅ Histórico limpo com sucesso");
        await carregarLogsAdmin();
        await carregarStats();
        await carregarGraficoLogs();

    } catch (err) {
        console.error("Erro ao limpar histórico:", err);
        mostrarMensagem("Erro inesperado");
    }
}

// Expor funções globalmente
window.carregarLogsAdmin = carregarLogsAdmin;
window.deletarLog = deletarLog;
window.limparTodoHistorico = limparTodoHistorico;