// =========================
// 👁 FACE API
// =========================
async function carregarFaceAPI(){

  try{

    await faceapi.nets.tinyFaceDetector.loadFromUri("./models");

    await faceapi.nets.faceLandmark68Net.loadFromUri("./models");

    await faceapi.nets.faceRecognitionNet.loadFromUri("./models");

    faceApiPronta = true;

    console.log("Face API carregada");

  }catch(error){

    console.log(error);

  }

}

async function carregarAlunosCache(){

  const { data:alunos, error } =
    await supabaseClient

      .from("alunos")

      .select("id,nome,descriptor");

  if(error){

    console.log(error);

    return;

  }

  alunosCache = alunos;

  alunos.forEach(aluno=>{

  console.log(
    aluno.nome,
    aluno.descriptor?.length
  );

});

function validarPose(detection){

  const nariz =
    detection.landmarks.getNose()[3];

  const olhoEsq =
    detection.landmarks.getLeftEye()[0];

  const olhoDir =
    detection.landmarks.getRightEye()[3];

  const centroOlhos =
    (olhoEsq.x + olhoDir.x) / 2;

  switch(etapaCaptura){

    case 0:
      return true;

    case 1:
      return nariz.x < centroOlhos - 10;

    case 2:
      return nariz.x > centroOlhos + 10;

    case 3:
      return nariz.y < olhoEsq.y - 5;

    case 4:
      return nariz.y > olhoEsq.y + 15;

    default:
      return false;
  }

}