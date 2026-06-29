// =========================
// 👁 FACE API
// =========================
async function carregarFaceAPI(){
    console.log("CARREGAR FACE API");

    try{
        await faceapi.nets.tinyFaceDetector.loadFromUri("./models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("./models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("./models");

        window.faceApiPronta = true;
        console.log("✅ Face API carregada com sucesso");
    } catch(error){
        console.error("❌ Erro ao carregar Face API:", error);
    }
}

async function carregarAlunosCache(){
    try {
        if (!window.supabaseClient) {
            console.error("supabaseClient não encontrado");
            return;
        }

        const { data: alunos, error } = await window.supabaseClient
            .from("alunos")
            .select("id, nome, descriptor");

        if (error) {
            console.error("Erro ao carregar alunos:", error);
            return;
        }

        window.alunosCache = alunos || [];
        console.log(`✅ ${alunos.length} alunos carregados do banco`);

        alunos.forEach(aluno => {
            console.log(`Aluno: ${aluno.nome} | Descriptor: ${aluno.descriptor ? aluno.descriptor.length : 0}`);
        });

        if (typeof criarMatcher === 'function') {
            await criarMatcher();
        }
    } catch (e) {
        console.error("Erro em carregarAlunosCache:", e);
    }
}

function validarPose(detection){
    if (!detection || !detection.landmarks) return false;

    const nariz = detection.landmarks.getNose()[3];
    const olhoEsq = detection.landmarks.getLeftEye()[0];
    const olhoDir = detection.landmarks.getRightEye()[3];
    const centroOlhos = (olhoEsq.x + olhoDir.x) / 2;

    switch(window.etapaCaptura || 0){
        case 0: return true;
        case 1: return nariz.x < centroOlhos - 10;
        case 2: return nariz.x > centroOlhos + 10;
        case 3: return nariz.y < olhoEsq.y - 5;
        case 4: return nariz.y > olhoEsq.y + 15;
        default: return false;
    }
}

// Expor funções globais (importante para cadastro.js)
window.carregarFaceAPI = carregarFaceAPI;
window.carregarAlunosCache = carregarAlunosCache;
window.validarPose = validarPose;