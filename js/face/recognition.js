// =========================
// 👁 MONITOR DE RECONHECIMENTO (CONSOLE LIMPO)
// =========================
let monitorInterval = null;
let estaNoMonitor = false;

function iniciarMonitor() {
    if (monitorInterval) return;
    console.log("🔄 Monitor ATIVADO");
    estaNoMonitor = true;
    monitorInterval = setInterval(reconhecerFace, 350);
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
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptors();

        if (detections.length === 0) return;

        for (const detection of detections) {
            const resultado = window.faceMatcher.findBestMatch(detection.descriptor);

            if (resultado.label === "unknown" || resultado.distance > 0.55) continue;

            const aluno = window.alunosCache.find(a => a.id === resultado.label);
            if (!aluno) continue;

            const nome = aluno.nome;

            const agora = Date.now();
            window.ultimoReconhecimento = window.ultimoReconhecimento || {};

            if (window.ultimoReconhecimento[nome] && agora - window.ultimoReconhecimento[nome] < 12000) {
                continue;
            }

            // LOG MÍNIMO
            console.log(`✅ ${nome} reconhecido`);

            // UI
            document.getElementById("statusTitulo").innerText = "✅ Aluno reconhecido";
            document.getElementById("statusTexto").innerText = nome;

            if (typeof mostrarMensagem === "function") {
                mostrarMensagem(`✅ ${nome} reconhecido!`);
            }

            window.ultimoReconhecimento[nome] = agora;
            await registrarLog(aluno);
        }
    } catch (error) {
        console.error("Erro no reconhecimento:", error);
    } finally {
        window.reconhecendo = false;
    }
}

// Registrar Log (mantido, mas com menos logs)
async function registrarLog(aluno) {
    if (!aluno?.id || !aluno?.nome) return;

    try {
        const { data: ultimoLog } = await window.supabaseClient
            .from("logs_reconhecimento")
            .select("status")
            .eq("aluno_id", aluno.id)
            .order("horario", { ascending: false })
            .limit(1);

        const ultimoStatus = ultimoLog?.[0]?.status;
        const statusAtual = (ultimoStatus === "Entrada") ? "Saída" : "Entrada";

        const { error } = await window.supabaseClient
            .from("logs_reconhecimento")
            .insert([{
                aluno_id: aluno.id,
                nome_aluno: aluno.nome,
                status: statusAtual,
                horario: new Date().toISOString()
            }]);

        if (error) {
            console.error("Erro ao inserir log:", error.message);
        } else {
            console.log(`📝 ${statusAtual} → ${aluno.nome}`);
        }

        await carregarStats?.();
        await carregarGraficoLogs?.();
        await carregarLogs?.();

    } catch (err) {
        console.error("Erro no registrarLog:", err);
    }
}

window.iniciarMonitor = iniciarMonitor;
window.pararMonitor = pararMonitor;