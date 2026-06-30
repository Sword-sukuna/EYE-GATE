// =========================
// 👁 MONITOR + CADASTRO DE CÂMERAS - VERSÃO PROFISSIONAL
// =========================

let monitorInterval = null;
let estaNoMonitor = false;
let cameraAtual = null;

function iniciarMonitor() {
    if (monitorInterval) return;
    console.log("🔄 Monitor ATIVADO");
    estaNoMonitor = true;
    carregarCameras();
    monitorInterval = setInterval(reconhecerFace, 4000);
}

function pararMonitor() {
    if (monitorInterval) {
        clearInterval(monitorInterval);
        monitorInterval = null;
    }
    estaNoMonitor = false;
    console.log("⏹ Monitor PAUSADO");
}

async function reconhecerFace() {
    if (!estaNoMonitor || !window.faceApiPronta || !window.matcherPronto || !window.faceMatcher) return;
    if (window.reconhecendo) return;

    window.reconhecendo = true;

    try {
        const video = document.getElementById("monitorVideo");
        if (!video || video.readyState < 2) return;

        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ 
                inputSize: 416, 
                scoreThreshold: 0.5 
            }))
            .withFaceLandmarks()
            .withFaceDescriptors();

        if (detections.length === 0) return;

        for (const detection of detections) {
            const resultado = window.faceMatcher.findBestMatch(detection.descriptor);
            if (resultado.label === "unknown" || resultado.distance > 0.50) continue;

            const aluno = window.alunosCache.find(a => a.id === resultado.label);
            if (!aluno) continue;

            const nome = aluno.nome;
            const agora = Date.now();

            if (window.ultimoReconhecimento?.[nome] && agora - window.ultimoReconhecimento[nome] < 12000) continue;

            atualizarStatusUI(nome);
            await registrarLog(aluno);

            window.ultimoReconhecimento = window.ultimoReconhecimento || {};
            window.ultimoReconhecimento[nome] = agora;
        }
    } catch (error) {
        console.error("Erro no reconhecimento:", error);
    } finally {
        window.reconhecendo = false;
    }
}

function atualizarStatusUI(nome) {
    document.getElementById("statusTitulo").innerText = "✅ Aluno Reconhecido";
    document.getElementById("statusTexto").innerText = nome;
    mostrarMensagem(`✅ ${nome} registrado com sucesso!`, "success");
}

// ==================== CADASTRO PROFISSIONAL DE CÂMERAS ====================
async function cadastrarCamera() {
    const nome = prompt("📍 Nome da câmera (ex: Porta Principal):");
    if (!nome?.trim()) return;

    const local = prompt("📍 Local da câmera (ex: Entrada Bloco A):");
    if (!local?.trim()) return;

    try {
        const { error } = await window.supabaseClient
            .from("cameras")
            .insert([{
                nome: nome.trim(),
                local: local.trim(),
                status: true,
                created_at: new Date().toISOString()
            }]);

        if (error) throw error;

        mostrarMensagem(`✅ Câmera "${nome}" cadastrada!`, "success");
        await carregarCameras();
    } catch (e) {
        console.error(e);
        mostrarMensagem("❌ Erro ao cadastrar câmera", "danger");
    }
}

async function carregarCameras() {
    const select = document.getElementById("cameraSelect");
    if (!select) return;

    try {
        const { data, error } = await window.supabaseClient
            .from("cameras")
            .select("*")
            .eq("status", true)
            .order("nome");

        if (error) throw error;

        select.innerHTML = '<option value="">Selecione uma câmera...</option>';

        data.forEach(cam => {
            const option = document.createElement("option");
            option.value = cam.id;
            option.textContent = `${cam.nome} — ${cam.local}`;
            if (cam.id === cameraAtual) option.selected = true;
            select.appendChild(option);
        });
    } catch (e) {
        console.error("Erro ao carregar câmeras:", e);
    }
}

function selecionarCamera(id) {
    if (!id) return;
    cameraAtual = id;
    pararMonitor();
    setTimeout(() => {
        iniciarMonitor();
        mostrarMensagem("📹 Câmera alterada com sucesso", "success");
    }, 500);
}

// Expor funções globais
window.iniciarMonitor = iniciarMonitor;
window.pararMonitor = pararMonitor;
window.cadastrarCamera = cadastrarCamera;
window.selecionarCamera = selecionarCamera;
window.carregarCameras = carregarCameras;