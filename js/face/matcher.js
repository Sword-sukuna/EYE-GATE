async function criarMatcher() {
    try {
        console.log("🔨 Criando Face Matcher... Alunos:", alunosCache.length);

        const labeledDescriptors = [];

        for (const aluno of alunosCache) {
            if (!aluno.descriptor) continue;

            let descriptors = aluno.descriptor;

            // Se for array de arrays (5 poses), pega o primeiro ou calcula média
            if (Array.isArray(descriptors) && Array.isArray(descriptors[0])) {
                console.log(`Aluno ${aluno.nome} tem múltiplos descriptors → usando o primeiro`);
                descriptors = descriptors[0]; // pega só o primeiro por enquanto
            }

            try {
                const floatDescriptor = new Float32Array(descriptors);
                
                labeledDescriptors.push(
                    new faceapi.LabeledFaceDescriptors(aluno.id, [floatDescriptor])
                );
            } catch (e) {
                console.warn(`Descriptor inválido do aluno ${aluno.nome}:`, e);
            }
        }

        if (labeledDescriptors.length === 0) {
            console.error("❌ Nenhum descriptor válido!");
            return;
        }

        window.faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
        window.matcherPronto = true;

        console.log(`✅ Matcher criado com ${labeledDescriptors.length} alunos`);
    } catch (e) {
        console.error("❌ Erro ao criar matcher:", e);
    }
}