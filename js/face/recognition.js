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
        console.error("❌ registrarLog: aluno ou nome inválido", aluno);
        return;
    }

    try {
        console.log(`📝 [LOG] Iniciando registro para: ${aluno.nome}`);

        if (!window.supabaseClient) {
            console.error("❌ supabaseClient não está inicializado!");
            return;
        }

        // === BUSCA ÚLTIMO STATUS ===
        const { data: logs, error: selectError } = await window.supabaseClient
            .from("logs_reconhecimento")
            .select("status")
            .eq("aluno", aluno.nome)
            .order("horario", { ascending: false })
            .limit(1);

        if (selectError) {
            console.error("❌ Erro na consulta (select):", selectError);
        }

        const ultimo = logs?.[0]?.status || null;
        const statusAtual = (ultimo === "Entrada") ? "Saída" : "Entrada";

        console.log(`⏭ Status anterior: ${ultimo || 'Nenhum'} | Novo: ${statusAtual}`);

        // === INSERE NOVO LOG ===
        const { error: insertError } = await window.supabaseClient
            .from("logs_reconhecimento")
            .insert([{
                aluno: aluno.nome,
                status: statusAtual,
                horario: new Date().toISOString()
            }]);

        if (insertError) {
            console.error("❌ Erro ao INSERIR log:", insertError);
            console.error("Código do erro:", insertError.code);
            console.error("Mensagem:", insertError.message);
        } else {
            console.log(`✅ SUCESSO! Log de ${statusAtual} registrado para ${aluno.nome}`);
        }

    } catch (err) {
        console.error("💥 ERRO GERAL no registrarLog:", err);
        console.error("Stack trace:", err.stack);
    }
}async function registrarLog(aluno) {
    try {
        console.log(`📝 Registrando log para: ${aluno.nome}`);

        const { data: logs } = await window.supabaseClient
            .from("logs_reconhecimento")   // ← alterado aqui
            .select("status")
            .eq("aluno", aluno.nome)
            .order("horario", { ascending: false })
            .limit(1);

        const ultimo = logs?.[0]?.status;
        const statusAtual = (ultimo === "Entrada") ? "Saída" : "Entrada";

        const { error } = await window.supabaseClient
            .from("logs_reconhecimento")   // ← alterado aqui
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