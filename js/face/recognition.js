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
    if (!window.faceApiPronta || !window.matcherPronto || !window.faceMatcher) return;
    if (window.reconhecendo) return;

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
            const resultado = window.faceMatcher.findBestMatch(detection.descriptor);

            console.log(`🔍 Match: ${resultado.label} | Dist: ${resultado.distance.toFixed(3)}`);

            if (resultado.label === "unknown" || resultado.distance > 0.65) continue;

            const aluno = window.alunosCache.find(a => a.id === resultado.label);
            if (!aluno) continue;

            const nome = aluno.nome;

            // === COOLDOWN (anti-spam) ===
            const agora = Date.now();
            window.ultimoReconhecimento = window.ultimoReconhecimento || {};
            
            if (window.ultimoReconhecimento[nome] && agora - window.ultimoReconhecimento[nome] < 8000) {
                continue; // 8 segundos de cooldown por pessoa
            }

            console.log(`🎉 RECONHECIDO: ${nome} (Dist: ${resultado.distance.toFixed(3)})`);

            // UI
            document.getElementById("statusTitulo").innerText = "✅ Aluno reconhecido";
            document.getElementById("statusTexto").innerText = nome;

            if (typeof mostrarMensagem === "function") {
                mostrarMensagem(`✅ ${nome} reconhecido!`);
            }

            // Salva o horário do último reconhecimento
            window.ultimoReconhecimento[nome] = agora;

            // Registra no banco
            await registrarLog(aluno);
        }
    } catch (error) {
        console.error("Erro no reconhecimento:", error);
    } finally {
        window.reconhecendo = false;
    }
}

async function registrarLog(aluno) {
    if (!aluno?.id || !aluno?.nome) return;

    try {
        console.log(`📝 Tentando registrar log para: ${aluno.nome}`);

        const statusAtual = "Entrada";   // ← depois podemos melhorar pra alternar

        const { error } = await window.supabaseClient
            .from("logs_reconhecimento")
            .insert([{
                aluno_id: aluno.id,
                nome_aluno: aluno.nome,
                status: statusAtual,
                horario: new Date().toISOString()
            }]);

        if (error) {
            console.error("❌ Erro ao inserir log:", error.message);
        } else {
            console.log(`✅ LOG REGISTRADO → ${statusAtual} | ${aluno.nome}`);
        }
    } catch (err) {
        console.error("💥 Erro no registrarLog:", err);
    }
}

function pararMonitor() {
    if (monitorInterval) {
        clearInterval(monitorInterval);
        monitorInterval = null;
    }
}