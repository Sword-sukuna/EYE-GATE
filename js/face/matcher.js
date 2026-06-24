// =========================
// 🔨 FACE MATCHER
// =========================
async function criarMatcher() {
    try {
        if (!window.alunosCache || window.alunosCache.length === 0) return;

        const labeledDescriptors = [];

        for (const aluno of window.alunosCache) {
            if (aluno.descriptor && Array.isArray(aluno.descriptor) && aluno.descriptor.length > 0) {
                const descriptorArray = Array.isArray(aluno.descriptor[0]) ? aluno.descriptor[0] : aluno.descriptor;
                labeledDescriptors.push(
                    new faceapi.LabeledFaceDescriptors(aluno.id, [new Float32Array(descriptorArray)])
                );
            }
        }

        if (labeledDescriptors.length === 0) return;

        window.faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.55);
        window.matcherPronto = true;

        console.log(`✅ Matcher criado com ${labeledDescriptors.length} alunos`);

    } catch (error) {
        console.error("Erro ao criar matcher:", error);
    }
}

window.criarMatcher = criarMatcher;