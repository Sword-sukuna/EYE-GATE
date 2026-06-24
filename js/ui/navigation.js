// =========================
// 📄 TROCAR PÁGINA (VERSÃO CORRIGIDA)
// =========================
function abrirPagina(id) {

    mostrarLoading("Abrindo página...");

    // Para tudo ANTES de trocar de página
    pararCameraCadastro();
    pararCameraMonitor();
    pararMonitor();           // Para o reconhecimento imediatamente

    setTimeout(() => {

        // Verificação de admin
        if (id === "adminPage" && !verificarAdminLocal()) {
            mostrarMensagem("Acesso negado");
            esconderLoading();
            return;
        }

        // Remove active de todas
        document.querySelectorAll(".page").forEach(page => {
            page.classList.remove("active-page");
        });

        const pagina = document.getElementById(id);

        if (!pagina) {
            console.error("Página não encontrada:", id);
            esconderLoading();
            return;
        }

        pagina.classList.add("active-page");

        esconderLoading();

        // ==================== CONTROLE ESPECÍFICO POR PÁGINA ====================
        if (id === "cadastroPage") {
            iniciarCameraCadastro();
        } 
        else if (id === "monitorPage") {
            iniciarCameraMonitor();
            iniciarMonitor();        // Só inicia quando realmente entrar
        } 
        // Em qualquer outra página → garante que o monitor está pausado
        else {
            pararMonitor();
        }

    }, 400); // Reduzi um pouco o delay
}