

lucide.createIcons();

  console.log(
    "Alunos carregados:",
    alunosCache.length
  );

  const labeledDescriptors =
  alunosCache.map((aluno)=>{

    let descritores = aluno.descriptor;

    // corrige descriptor antigo quebrado
    if(
      descritores.length > 0 &&
      typeof descritores[0] === "number"
    ){
      descritores = [descritores];
    }

    if(
  !descritores ||
  !Array.isArray(descritores) ||
  descritores.length === 0
){
  return null;
}

    return new faceapi.LabeledFaceDescriptors(
  aluno.id,
  descritores.map(
    d => new Float32Array(d)
  )
);

});

console.log("Descriptors carregados:");
console.log(labeledDescriptors);

    if(labeledDescriptors.length === 0){

  console.log("Nenhum aluno cadastrado");

  matcherPronto = false;

  return;

}

  faceMatcher =
    new faceapi.FaceMatcher(

      labeledDescriptors,

      0.68

    );

  matcherPronto = true;

  console.log(
  "FaceMatcher carregado"
);

console.log(
  "Alunos:",
  alunosCache
);

// Inicia a limpeza automática
iniciarLimpezaDiaria();


