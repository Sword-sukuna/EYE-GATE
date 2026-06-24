// =========================
// 📄 TROCAR PÁGINA (VERSÃO OTIMIZADA)
// =========================
function abrirPagina(id) {

    // Para tudo que consome recurso antes de trocar de página
    pararCameraCadastro();
    pararCameraMonitor();
    pararMonitor();           // ← Já tinha, bom

    mostrarLoading("Abrindo página...");

    setTimeout(() => {

        // Verificação de admin
        if (id === "adminPage" && !verificarAdminLocal()) {
            mostrarMensagem("Acesso negado");
            esconderLoading();
            return;
        }

        // Remove active de todas as páginas
        document.querySelectorAll(".page").forEach(page => {
            page.classList.remove("active-page");
        });

        const pagina = document.getElementById(id);

        console.log("Tentando abrir:", id);

        if (!pagina) {
            console.error("Página não encontrada:", id);
            esconderLoading();
            return;
        }

        pagina.classList.add("active-page");

        esconderLoading();

        // ==================== CONTROLE DE CÂMERAS E MONITOR ====================
        if (id === "cadastroPage") {
            iniciarCameraCadastro();
        } 
        else if (id === "monitorPage") {
            iniciarCameraMonitor();
            iniciarMonitor();           // ← Garante que inicia
        } 
        else {
            // Para o monitor se sair de qualquer outra página
            pararMonitor();
        }

    }, 500);
}