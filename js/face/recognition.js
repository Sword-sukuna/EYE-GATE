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
    if (!window.faceApiPronta) return;
    if (!faceapi?.nets?.faceRecognitionNet?.isLoaded) return;
    if (window.reconhecendo || !window.matcherPronto || !window.faceMatcher) return;

    window.reconhecendo = true;

    try {
        const video = document.getElementById("monitorVideo");
        if (!video || video.readyState < 2) return;

        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptors();

        if (detections.length === 0) return;

        for (const detection of detections) {
            let resultado;
            try {
                resultado = window.faceMatcher.findBestMatch(detection.descriptor);
            } catch (e) {
                continue;
            }

            console.log(`🔍 Match: ${resultado.label} | Dist: ${resultado.distance.toFixed(3)}`);

            if (resultado.label === "unknown" || resultado.distance > 0.65) continue;

            const aluno = window.alunosCache.find(a => a.id === resultado.label);
            if (!aluno) continue;

            const nome = aluno.nome;

            console.log(`🎉 RECONHECIDO: ${nome} (Dist: ${resultado.distance.toFixed(3)})`);

            // UI
            document.getElementById("statusTitulo").innerText = "✅ Aluno reconhecido";
            document.getElementById("statusTexto").innerText = nome;

            if (typeof mostrarMensagem === "function") {
                mostrarMensagem(`✅ ${nome} reconhecido!`);
            }

            await registrarLog(aluno);   // ← deve aparecer agora
            window.ultimoReconhecimento = window.ultimoReconhecimento || {};
            window.ultimoReconhecimento[nome] = Date.now();
        }
    } catch (error) {
        console.error("Erro no reconhecimento:", error);
    } finally {
        window.reconhecendo = false;
    }
}

async function registrarLog(aluno) {
    if (!aluno?.id || !aluno?.nome) {
        console.error("❌ registrarLog: aluno inválido", aluno);
        return;
    }

    try {
        console.log(`📝 Tentando registrar log para: ${aluno.nome} (ID: ${aluno.id})`);

        if (!window.supabaseClient) {
            console.error("❌ supabaseClient não encontrado");
            return;
        }

        const statusAtual = "Entrada"; // Temporário para teste

        const { error } = await window.supabaseClient
            .from("logs_reconhecimento")
            .insert([{
                aluno_id: aluno.id,           // ← Coluna correta
                nome_aluno: aluno.nome,       // ← Coluna correta
                status: statusAtual,
                horario: new Date().toISOString()
            }]);

        if (error) {
            console.error("❌ Erro ao inserir log:", error.message);
            console.error("Detalhes completos:", error);
        } else {
            console.log(`✅ LOG INSERIDO COM SUCESSO → ${statusAtual} | ${aluno.nome}`);
        }
    } catch (err) {
        console.error("💥 Erro grave no registrarLog:", err);
    }
}

function pararMonitor() {
    if (monitorInterval) {
        clearInterval(monitorInterval);
        monitorInterval = null;
    }
}