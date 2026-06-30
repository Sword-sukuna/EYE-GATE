// =========================
// 👁 MONITOR DE RECONHECIMENTO (COM CADASTRO REAL DE CÂMERAS)
// =========================
let monitorInterval = null;
let estaNoMonitor = false;
let cameraAtual = 1;

function iniciarMonitor() {
    if (monitorInterval) return;
    console.log("🔄 Monitor ATIVADO");
    estaNoMonitor = true;
    monitorInterval = setInterval(reconhecerFace, 5000);
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
    if (!estaNoMonitor) return;
    if (!window.faceApiPronta || !window.matcherPronto || !window.faceMatcher) return;
    if (window.reconhecendo) return;

    window.reconhecendo = true;

    try {
        const video = document.getElementById("monitorVideo");
        if (!video || video.readyState < 2) return;

        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 }))
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
            window.ultimoReconhecimento = window.ultimoReconhecimento || {};

            if (window.ultimoReconhecimento[nome] && agora - window.ultimoReconhecimento[nome] < 15000) continue;

            console.log(`🎉 RECONHECIDO: ${nome}`);

            document.getElementById("statusTitulo").innerText = "✅ Aluno reconhecido";
            document.getElementById("statusTexto").innerText = nome;

            if (typeof mostrarMensagem === "function") mostrarMensagem(`✅ ${nome} reconhecido!`);

            window.ultimoReconhecimento[nome] = agora;
            await registrarLog(aluno);
        }
    } catch (error) {
        console.error("Erro no reconhecimento:", error);
    } finally {
        window.reconhecendo = false;
    }
}

async function registrarLog(aluno) { /* seu código original */ }

// =========================
// CADASTRO DE CÂMERAS (REAL)
// =========================
async function cadastrarCamera() {
    const nome = prompt("Nome da câmera (ex: Porta Principal):");
    if (!nome) return;

    const local = prompt("Local da câmera (ex: Entrada Principal):");
    if (!local) return;

    try {
        const { error } = await window.supabaseClient
            .from("cameras")
            .insert([{
                nome: nome,
                local: local,
                status: true
            }]);

        if (error) {
            console.error(error);
            mostrarMensagem("Erro ao cadastrar câmera");
        } else {
            mostrarMensagem(`Câmera "${nome}" cadastrada com sucesso!`);
            carregarCameras();
        }
    } catch (e) {
        console.error(e);
    }
}

async function carregarCameras() {
    const select = document.getElementById("cameraSelect");
    if (!select) return;

    try {
        const { data, error } = await window.supabaseClient
            .from("cameras")
            .select("*")
            .eq("status", true);

        if (error) throw error;

        select.innerHTML = "";
        data.forEach(cam => {
            const option = document.createElement("option");
            option.value = cam.id;
            option.textContent = cam.nome;
            if (cam.id === cameraAtual) option.selected = true;
            select.appendChild(option);
        });
    } catch (e) {
        console.error(e);
    }
}

function selecionarCamera(id) {
    cameraAtual = parseInt(id);
    pararMonitor();
    setTimeout(() => {
        iniciarMonitor();
        mostrarMensagem(`Câmera ${id} ativada`);
    }, 500);
}

// Carregar câmeras ao iniciar o monitor
async function carregarCameras() {
    const select = document.getElementById("cameraSelect");
    if (!select) return;

    try {
        const { data, error } = await window.supabaseClient
            .from("cameras")
            .select("*")
            .eq("status", true);

        if (error) throw error;

        select.innerHTML = "";
        data.forEach(cam => {
            const option = document.createElement("option");
            option.value = cam.id;
            option.textContent = cam.nome;
            if (cam.id === cameraAtual) option.selected = true;
            select.appendChild(option);
        });
    } catch (e) {
        console.error("Erro ao carregar câmeras:", e);
    }
}

// Chame no iniciarMonitor
function iniciarMonitor() {
    if (monitorInterval) return;
    console.log("🔄 Monitor ATIVADO");
    estaNoMonitor = true;
    carregarCameras(); // Carrega as câmeras
    monitorInterval = setInterval(reconhecerFace, 5000);
}

// Expor
window.iniciarMonitor = iniciarMonitor;
window.pararMonitor = pararMonitor;
window.cadastrarCamera = cadastrarCamera;
window.selecionarCamera = selecionarCamera;
window.carregarCameras = carregarCameras;