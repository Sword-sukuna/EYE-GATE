// =========================
// 📋 ADMIN LOGS (COMPLETO COM EXPORT CSV)
// =========================
async function carregarLogsAdmin() {
    const container = document.getElementById("adminLogs");
    if (!container) return;

    try {
        if (!window.supabaseClient) {
            container.innerHTML = `<p style="color:red; text-align:center;">Erro: Supabase não carregado</p>`;
            return;
        }

        const { data, error } = await window.supabaseClient
            .from("logs_reconhecimento")
            .select("*")
            .order("horario", { ascending: false })
            .limit(100);

        if (error) {
            console.error(error);
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
                    <button class="delete-btn" onclick="deletarLog('${log.id}')">🗑 Excluir</button>
                </div>
            `;
        });

        // Botões de ação
        const divBotoes = document.createElement("div");
        divBotoes.style.marginTop = "20px";
        divBotoes.style.display = "flex";
        divBotoes.style.gap = "10px";

        // Botão Limpar Tudo
        const btnLimpar = document.createElement("button");
        btnLimpar.className = "delete-all-btn";
        btnLimpar.innerHTML = "🗑 Limpar Todo Histórico";
        btnLimpar.onclick = limparTodoHistorico;
        divBotoes.appendChild(btnLimpar);

        // Botão Exportar CSV
        const btnExport = document.createElement("button");
        btnExport.className = "export-btn";
        btnExport.innerHTML = "📥 Exportar CSV";
        btnExport.onclick = exportarLogsCSV;
        divBotoes.appendChild(btnExport);

        container.appendChild(divBotoes);

    } catch (e) {
        console.error("Erro em carregarLogsAdmin:", e);
    }
}

// =========================
// 🗑 DELETAR LOG
// =========================
async function deletarLog(id) {
    if (!confirm("Excluir este registro?")) return;

    try {
        const { error } = await window.supabaseClient
            .from("logs_reconhecimento")
            .delete()
            .eq("id", id);

        if (error) throw error;

        mostrarMensagem("Registro excluído");
        await carregarLogsAdmin();
        await carregarStats();
        await carregarGraficoLogs();

    } catch (err) {
        console.error(err);
        mostrarMensagem("Erro ao excluir");
    }
}

// =========================
// 🗑 LIMPAR TODO HISTÓRICO
// =========================
async function limparTodoHistorico() {
    if (!confirm("⚠️ APAGAR TODO o histórico?\nEssa ação não pode ser desfeita!")) return;

    try {
        const { error } = await window.supabaseClient
            .from("logs_reconhecimento")
            .delete()
            .neq("id", "00000000-0000-0000-0000-000000000000");

        if (error) throw error;

        mostrarMensagem("✅ Histórico limpo");
        await carregarLogsAdmin();
        await carregarStats();
        await carregarGraficoLogs();

    } catch (err) {
        console.error(err);
        mostrarMensagem("Erro ao limpar");
    }
}

// =========================
// 📥 EXPORTAR CSV
// =========================
async function exportarLogsCSV() {
    try {
        const { data, error } = await window.supabaseClient
            .from("logs_reconhecimento")
            .select("*")
            .order("horario", { ascending: false });

        if (error) throw error;

        let csv = "Nome,Status,Horario\n";

        data.forEach(log => {
            const horario = new Date(log.horario).toLocaleString("pt-BR");
            csv += `"${log.nome_aluno}","${log.status}","${horario}"\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "logs_reconhecimento.csv";
        a.click();

        mostrarMensagem("CSV baixado com sucesso");

    } catch (err) {
        console.error(err);
        mostrarMensagem("Erro ao exportar CSV");
    }
}

// Expor funções
window.carregarLogsAdmin = carregarLogsAdmin;
window.deletarLog = deletarLog;
window.limparTodoHistorico = limparTodoHistorico;
window.exportarLogsCSV = exportarLogsCSV;