async function criarMatcher() {
    try {
        console.log("🔨 Criando Face Matcher...");

        const labeledDescriptors = alunosCache
            .map(aluno => {
                if (!aluno.descriptor || !Array.isArray(aluno.descriptor)) {
                    console.warn(`Aluno ${aluno.nome} sem descriptor válido`);
                    return null;
                }

                try {
                    // Força a conversão correta
                    const descriptorArray = new Float32Array(aluno.descriptor);
                    
                    return new faceapi.LabeledFaceDescriptors(
                        aluno.id,
                        [descriptorArray]
                    );
                } catch (e) {
                    console.warn(`Erro no descriptor de ${aluno.nome}:`, e);
                    return null;
                }
            })
            .filter(Boolean);

        if (labeledDescriptors.length === 0) {
            console.error("❌ Nenhum descriptor válido encontrado");
            return;
        }

        window.faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
        window.matcherPronto = true;

        console.log(`✅ Matcher criado com sucesso! ${labeledDescriptors.length} alunos carregados`);
    } catch (e) {
        console.error("❌ Erro grave ao criar matcher:", e);
    }
}