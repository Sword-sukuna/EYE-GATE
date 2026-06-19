// =========================
// 👁 MONITOR
// =========================
let monitorInterval = null;

function iniciarMonitor() {
    if (monitorInterval) return;
    
    console.log("🔄 Iniciando monitor de reconhecimento...");
    monitorInterval = setInterval(reconhecerFace, 300);
}

async function reconhecerFace() {
    if (!window.faceApiPronta) {
        console.log("⏳ Face API ainda não está pronta");
        return;
    }
    if (!faceapi?.nets?.faceRecognitionNet?.isLoaded) {
        console.log("⏳ Modelos do Face API ainda carregando");
        return;
    }
    if (window.reconhecendo || !window.matcherPronto || !window.faceMatcher) {
        // console.log("⏳ Aguardando matcher ou já reconhecendo");
        return;
    }

    window.reconhecendo = true;

    try {
        const video = document.getElementById("monitorVideo");
        if (!video || video.readyState < 2) {
            // console.log("📹 Vídeo não pronto");
            return;
        }

        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({
                inputSize: 320,
                scoreThreshold: 0.5
            }))
            .withFaceLandmarks()
            .withFaceDescriptors();

        if (detections.length === 0) {
            document.getElementById("statusTitulo").innerText = "Nenhum rosto detectado";
            document.getElementById("statusTexto").innerText = "Posicione seu rosto na câmera";
            return;
        }

        console.log(`👀 ${detections.length} rosto(s) detectado(s)!`);   // ← Esse log deve aparecer agora

        for (const detection of detections) {
            const resultado = window.faceMatcher.findBestMatch(detection.descriptor);

            console.log(`🔍 Match: ${resultado.label} | Distância: ${resultado.distance.toFixed(3)}`);

            if (resultado.label === "unknown" || resultado.distance > 0.65) continue;

            const aluno = window.alunosCache.find(a => a.id === resultado.label);
            if (!aluno) continue;

            const nome = aluno.nome;

            window.contadorFrames[nome] = (window.contadorFrames[nome] || 0) + 1;

            Object.keys(window.contadorFrames).forEach(n => {
                if (n !== nome) window.contadorFrames[n] = 0;
            });

            if (window.contadorFrames[nome] < 5) continue;

            window.contadorFrames[nome] = 0;

            const agora = Date.now();
            if (window.ultimoReconhecimento[nome] && agora - window.ultimoReconhecimento[nome] < window.TEMPO_BLOQUEIO) {
                continue;
            }

            window.ultimoReconhecimento[nome] = agora;

            mostrarMensagem(`✅ Aluno reconhecido: ${nome}`);
            document.getElementById("statusTitulo").innerText = "Aluno reconhecido ✅";
            document.getElementById("statusTexto").innerText = `${nome} identificado`;

            await registrarLog(aluno);
        }
    } catch (error) {
        console.error("❌ Erro no reconhecimento:", error);
    } finally {
        window.reconhecendo = false;
    }
}

async function registrarLog(aluno) { /* mesma função anterior */ 
    // ... (pode deixar a mesma que eu te passei antes)
}

function pararMonitor() {
    if (monitorInterval) {
        clearInterval(monitorInterval);
        monitorInterval = null;
        console.log("⏹ Monitor parado");
    }
}