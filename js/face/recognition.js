// =========================
// 👁 MONITOR
// =========================
let monitorInterval = null;

function iniciarMonitor() {
    if (monitorInterval) return;
    monitorInterval = setInterval(reconhecerFace, 250);
}

async function reconhecerFace() {
    if (!window.faceApiPronta || !faceapi.nets.faceRecognitionNet?.isLoaded) return;
    if (window.reconhecendo || !window.matcherPronto || !window.faceMatcher) return;

    window.reconhecendo = true;

    try {
        const video = document.getElementById("monitorVideo");
        if (!video || video.readyState < 2) return;

        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptors();

        if (detections.length === 0) {
            document.getElementById("statusTitulo").innerText = "Nenhum rosto detectado";
            document.getElementById("statusTexto").innerText = "Aguardando...";
            return;
        }

        for (const detection of detections) {
            const resultado = window.faceMatcher.findBestMatch(detection.descriptor);

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

            mostrarMensagem(`Aluno reconhecido: ${nome}`);

            document.getElementById("statusTitulo").innerText = "Aluno reconhecido ✅";
            document.getElementById("statusTexto").innerText = `${nome} identificado`;

            await registrarLog(aluno);
        }
    } catch (error) {
        console.error("Erro no reconhecimento:", error);
    } finally {
        window.reconhecendo = false;
    }
}

async function registrarLog(aluno) {
    try {
        const { data: logs } = await window.supabaseClient
            .from("logs")
            .select("*")
            .eq("aluno", aluno.nome)
            .order("horario", { ascending: false })
            .limit(1);

        const statusAtual = (logs?.[0]?.status === "Entrada") ? "Saída" : "Entrada";

        await window.supabaseClient.from("logs").insert([{
            aluno: aluno.nome,
            status: statusAtual,
            horario: new Date().toISOString()
        }]);
    } catch (err) {
        console.error(err);
    }
}

function pararMonitor() {
    if (monitorInterval) {
        clearInterval(monitorInterval);
        monitorInterval = null;
    }
}