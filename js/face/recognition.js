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

            // ==================== RECONHECIMENTO ====================
            if (resultado.label === "unknown" || resultado.distance > 0.75) continue;

            const aluno = window.alunosCache.find(a => a.id === resultado.label);
            if (!aluno) continue;

            const nome = aluno.nome;

            console.log(`🎉 RECONHECIDO: ${nome} (Dist: ${resultado.distance.toFixed(3)})`);

            // Atualiza a tela
            document.getElementById("statusTitulo").innerText = "✅ Aluno reconhecido";
            document.getElementById("statusTexto").innerText = nome;

            // Tenta mostrar toast
            if (typeof mostrarMensagem === "function") {
                mostrarMensagem(`✅ ${nome} foi reconhecido!`);
            }

            // Registra no banco
            await registrarLog(aluno);

            // Anti-repetição
            window.ultimoReconhecimento[nome] = Date.now();
        }
    } catch (error) {
        console.error("Erro no reconhecimento:", error);
    } finally {
        window.reconhecendo = false;
    }
}

async function registrarLog(aluno) {
    try {
        console.log(`📝 Registrando log para: ${aluno.nome}`);

        const { data: logs } = await window.supabaseClient
            .from("logs")
            .select("status")
            .eq("aluno", aluno.nome)
            .order("horario", { ascending: false })
            .limit(1);

        const ultimo = logs?.[0]?.status;
        const statusAtual = (ultimo === "Entrada") ? "Saída" : "Entrada";

        const { error } = await window.supabaseClient
            .from("logs")
            .insert([{
                aluno: aluno.nome,
                status: statusAtual,
                horario: new Date().toISOString()
            }]);

        if (error) console.error("Erro ao inserir log:", error);
        else console.log(`✅ Log de ${statusAtual} registrado para ${aluno.nome}`);
    } catch (err) {
        console.error("Erro no registrarLog:", err);
    }
}

function pararMonitor() {
    if (monitorInterval) {
        clearInterval(monitorInterval);
        monitorInterval = null;
    }
}