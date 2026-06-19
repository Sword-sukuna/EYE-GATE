async function criarMatcher() {
    try {
        console.log("🔨 Criando Face Matcher... Alunos:", alunosCache.length);

        const labeledDescriptors = alunosCache
            .map(aluno => {
                if (!aluno.descriptor) return null;

                let desc = aluno.descriptor;
                if (Array.isArray(desc) && Array.isArray(desc[0])) {
                    desc = desc[0]; // pega só o primeiro descriptor
                }

                return new faceapi.LabeledFaceDescriptors(
                    aluno.id,
                    [new Float32Array(desc)]
                );
            })
            .filter(Boolean);

        window.faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
        window.matcherPronto = true;

        console.log(`✅ Matcher criado com ${labeledDescriptors.length} alunos`);
    } catch (e) {
        console.error("Erro ao criar matcher:", e);
    }
}