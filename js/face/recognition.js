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

            if (resultado.label === "unknown" || resultado.distance > 0.80) continue;  // threshold bem alto

            const aluno = window.alunosCache.find(a => a.id === resultado.label);
            if (!aluno) continue;

            const nome = aluno.nome;

            console.log(`🎉 RECONHECIDO: ${nome} (Dist: ${resultado.distance.toFixed(3)})`);

            // Força atualização na tela
            document.getElementById("statusTitulo").innerText = "✅ Aluno reconhecido";
            document.getElementById("statusTexto").innerText = nome;

            if (typeof mostrarMensagem === "function") {
                mostrarMensagem(`✅ ${nome} reconhecido!`);
            }

            await registrarLog(aluno);
            window.ultimoReconhecimento[nome] = Date.now();
        }
    } catch (error) {
        console.error("Erro no reconhecimento:", error);
    } finally {
        window.reconhecendo = false;
    }
}

async function registrarLog(aluno) {
    if (!aluno?.nome) {
        console.error("❌ registrarLog: aluno inválido", aluno);
        return;
    }

    try {
        console.log(`📝 [LOG] Tentando registrar para: ${aluno.nome}`);

        if (!window.supabaseClient) {
            console.error("❌ supabaseClient não encontrado!");
            return;
        }

        // Busca último log
        const { data: logs, error: selectError } = await window.supabaseClient
            .from("logs_reconhecimento")
            .select("status")
            .eq("aluno", aluno.nome)
            .order("horario", { ascending: false })
            .limit(1);

        if (selectError) {
            console.error("❌ Erro ao buscar último log:", selectError);
        }

        const ultimo = logs?.[0]?.status || null;
        const statusAtual = (ultimo === "Entrada") ? "Saída" : "Entrada";

        console.log(`⏭ Status anterior: ${ultimo || 'Nenhum'} → Novo: ${statusAtual}`);

        // Insere novo log
        const { error: insertError } = await window.supabaseClient
            .from("logs_reconhecimento")
            .insert([{
                aluno: aluno.nome,
                status: statusAtual,
                horario: new Date().toISOString()
            }]);

        if (insertError) {
            console.error("❌ Erro ao INSERIR log:", insertError);
            console.error("Código:", insertError.code, "| Mensagem:", insertError.message);
        } else {
            console.log(`✅ SUCESSO! Log de ${statusAtual} registrado para ${aluno.nome}`);
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