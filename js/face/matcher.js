// =========================
// 🔨 FACE MATCHER
// =========================

async function criarMatcher() {
    try {
        console.log(`🔨 Criando Face Matcher... Alunos: ${window.alunosCache?.length || 0}`);

        if (!window.alunosCache || window.alunosCache.length === 0) {
            console.warn("⚠️ Nenhum aluno com descriptor encontrado");
            return;
        }

        const labeledDescriptors = [];

        for (const aluno of window.alunosCache) {
            if (aluno.descriptor && Array.isArray(aluno.descriptor) && aluno.descriptor.length > 0) {
                try {
                    // Converte o descriptor corretamente
                    const descriptorArray = Array.isArray(aluno.descriptor[0]) 
                        ? aluno.descriptor[0] 
                        : aluno.descriptor;

                    const floatDescriptor = new Float32Array(descriptorArray);

                    labeledDescriptors.push(
                        new faceapi.LabeledFaceDescriptors(
                            aluno.id,
                            [floatDescriptor]
                        )
                    );

                    console.log(`✅ Descriptor carregado: ${aluno.nome}`);
                } catch (e) {
                    console.warn(`❌ Descriptor inválido para ${aluno.nome}:`, e);
                }
            } else {
                console.warn(`⚠️ Aluno sem descriptor válido: ${aluno.nome}`);
            }
        }

        if (labeledDescriptors.length === 0) {
            console.error("❌ Nenhum descriptor válido encontrado para criar o matcher");
            return;
        }

        window.faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
        window.matcherPronto = true;

        console.log(`✅ Matcher criado com sucesso com ${labeledDescriptors.length} alunos`);

    } catch (error) {
        console.error("Erro ao criar matcher:", error);
    }
}

// Expor globalmente
window.criarMatcher = criarMatcher;