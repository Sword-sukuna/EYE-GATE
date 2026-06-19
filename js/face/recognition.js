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
    if (!window.faceApiPronta || !faceapi?.nets?.faceRecognitionNet?.isLoaded) return;
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
            document.getElementById("statusTexto").innerText = "Posicione seu rosto";
            return;
        }

        for (const detection of detections) {
            let resultado;
            try {
                resultado = window.faceMatcher.findBestMatch(detection.descriptor);
            } catch (e) {
                continue;
            }

            console.log(`🔍 Match: ${resultado.label} | Dist: ${resultado.distance.toFixed(3)}`);

            if (resultado.label === "unknown" || resultado.distance > 0.75) continue;

            const aluno = window.alunosCache.find(a => a.id === resultado.label);
            if (!aluno) continue;

            const nome = aluno.nome;

            // === FORÇANDO RECONHECIMENTO ===
            console.log(`🎉 RECONHECIDO IMEDIATO: ${nome} (Dist: ${resultado.distance.toFixed(3)})`);

            mostrarMensagem(`✅ Aluno reconhecido: ${nome}`);
            
            document.getElementById("statusTitulo").innerText = "Aluno reconhecido ✅";
            document.getElementById("statusTexto").innerText = `${nome} identificado com sucesso`;

            await registrarLog(aluno);

            // Anti-spam (não reconhece de novo por 4 segundos)
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
        console.log(`📝 Tentando registrar log para: ${aluno.nome}`);

        const { data: logs, error: logsError } = await window.supabaseClient
            .from("logs")
            .select("status")
            .eq("aluno", aluno.nome)
            .order("horario", { ascending: false })
            .limit(1);

        if (logsError) console.error("Erro ao buscar log:", logsError);

        const ultimoStatus = logs?.[0]?.status;
        const statusAtual = (ultimoStatus === "Entrada") ? "Saída" : "Entrada";

        const { error: insertError } = await window.supabaseClient
            .from("logs")
            .insert([{
                aluno: aluno.nome,
                status: statusAtual,
                horario: new Date().toISOString()
            }]);

        if (insertError) {
            console.error("❌ Erro ao salvar no Supabase:", insertError);
        } else {
            console.log(`✅ LOG REGISTRADO → ${statusAtual} para ${aluno.nome}`);
        }
    } catch (err) {
        console.error("❌ Erro no registrarLog:", err);
    }
}
function pararMonitor() {
    if (monitorInterval) {
        clearInterval(monitorInterval);
        monitorInterval = null;
        console.log("⏹ Monitor parado");
    }
}