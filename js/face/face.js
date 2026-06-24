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
        console.log("✅ Face API carregada");
    } catch(error){
        console.error("❌ Erro ao carregar Face API:", error);
    }
}

async function carregarAlunosCache(){
    try {
        if (!window.supabaseClient) return;

        const { data: alunos, error } = await window.supabaseClient
            .from("alunos")
            .select("id, nome, descriptor");

        if (error) {
            console.error("Erro ao carregar alunos:", error);
            return;
        }

        window.alunosCache = alunos || [];
        console.log(`✅ ${alunos.length} alunos carregados`);

        if (typeof criarMatcher === 'function') {
            await criarMatcher();
        }
    } catch (e) {
        console.error("Erro em carregarAlunosCache:", e);
    }
}

// Expor funções
window.carregarFaceAPI = carregarFaceAPI;
window.carregarAlunosCache = carregarAlunosCache;