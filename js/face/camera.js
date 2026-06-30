// =========================
// 📷 GERENCIAMENTO DE CÂMERAS (VERSÃO PROFISSIONAL)
// =========================

let streamCadastro = null;
let streamMonitor = null;

// ==================== CÂMERA PARA CADASTRO DE ALUNO ====================
async function iniciarCameraCadastro() {
    const video = document.getElementById("video");
    if (!video) return;
    if (streamCadastro) return; // Já está rodando

    try {
        streamCadastro = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: "user",
                width: { ideal: 640 },
                height: { ideal: 480 }
            },
            audio: false
        });
        video.srcObject = streamCadastro;
        console.log("✅ Câmera de cadastro iniciada");
    } catch (error) {
        console.error("Erro ao acessar câmera de cadastro:", error);
        mostrarMensagem("❌ Permita o acesso à câmera para cadastrar alunos", "danger");
    }
}

function pararCameraCadastro() {
    if (streamCadastro) {
        streamCadastro.getTracks().forEach(track => track.stop());
        streamCadastro = null;
    }
}

// ==================== CÂMERA PARA MONITORAMENTO ====================
async function iniciarCameraMonitor() {
    const video = document.getElementById("monitorVideo");
    if (!video) return;

    // Para qualquer stream anterior
    pararCameraMonitor();

    try {
        streamMonitor = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30 }
            },
            audio: false
        });
        
        video.srcObject = streamMonitor;
        console.log("📹 Stream do Monitor iniciada com sucesso");
    } catch (error) {
        console.error("Erro ao iniciar câmera do monitor:", error);
        mostrarMensagem("❌ Não foi possível acessar a câmera do monitor", "danger");
    }
}

function pararCameraMonitor() {
    if (streamMonitor) {
        streamMonitor.getTracks().forEach(track => track.stop());
        streamMonitor = null;
    }
}

// Expor funções globais
window.iniciarCameraCadastro = iniciarCameraCadastro;
window.pararCameraCadastro = pararCameraCadastro;
window.iniciarCameraMonitor = iniciarCameraMonitor;
window.pararCameraMonitor = pararCameraMonitor;