// =========================
// 👁 MONITOR
// =========================
let monitorInterval = null;

function iniciarMonitor(){

  if(monitorInterval)
    return;

  monitorInterval = setInterval(
    reconhecerFace,
    250
  );

}

// =========================
// 👁 RECONHECER FACE
// =========================
async function reconhecerFace(){

  if(!faceApiPronta) return;

if(!faceapi.nets.faceRecognitionNet.isLoaded) return;

  if(reconhecendo) return;

  reconhecendo = true;

  try{

    const video =
      document.getElementById("monitorVideo");

    if(!video) return;

    if(!matcherPronto || !faceMatcher)
      return;

   if(video.readyState < 2)
  return;

const detections =
  await faceapi
    .detectAllFaces(
      video,
      new faceapi.TinyFaceDetectorOptions({
       inputSize:320,
        scoreThreshold:0.5
      })
    )

    .withFaceLandmarks()
    .withFaceDescriptors();

    if(detections.length === 0){

  document.getElementById("statusTitulo").innerText =
    "Nenhum rosto detectado";

  document.getElementById("statusTexto").innerText =
    "Aguardando reconhecimento...";

  return;
}
console.log(
  "Faces detectadas:",
  detections
);

    for(const detection of detections){

      console.log(
  "Rosto detectado"
);

console.log(
  detection.descriptor
);

      const resultado =
        faceMatcher.findBestMatch(
          detection.descriptor
        );

        console.log(
  "Resultado:",
  resultado.label
);

console.log(
  "Distância:",
  resultado.distance
);

        console.log(
  "Nome:",
  resultado.label,
  "Distância:",
  resultado.distance
);

      if(
  resultado.label === "unknown" ||
  resultado.distance > 0.65
){

  console.log(
    "Desconhecido. Distância:",
    resultado.distance
  );

  continue;
}

const aluno =
  alunosCache.find(
    a => a.id === resultado.label
  );

  const nome = aluno.nome;

contadorFrames[nome] =
  (contadorFrames[nome] || 0) + 1;
  
Object.keys(contadorFrames).forEach(n => {

  if(n !== nome){

    contadorFrames[n] = 0;

  }

});

console.log(
  `${nome}: ${contadorFrames[nome]}/5`
);

if(contadorFrames[nome] < 5){

  continue;

}

contadorFrames[nome] = 0;

      if(!aluno)
        continue;

      const agora = Date.now();

      if(
  ultimoReconhecimento[aluno.nome] &&
  agora - ultimoReconhecimento[aluno.nome] < TEMPO_BLOQUEIO
){
  continue;
}

      ultimoReconhecimento[aluno.nome] = agora;

      mostrarMensagem(
        `Aluno reconhecido: ${aluno.nome}`
      );

      document.getElementById("statusTitulo").innerText =
  "Aluno reconhecido ✅";

document.getElementById("statusTexto").innerText =
  `${aluno.nome} identificado com sucesso`;

      console.log("Tentando salvar:", aluno);

// Busca último log do aluno
const respostaLogs = await supabaseClient
  .from("logs")
  .select("*")
  .eq("aluno", aluno.nome)
  .order("horario", {
    ascending: false
  })
  .limit(1);

const logsAluno = respostaLogs.data;
const logsError = respostaLogs.error;

if(logsError){

  console.log(logsError);

  continue;

}

const ultimoLog = logsAluno[0];

let statusAtual = "Entrada";

if(
  ultimoLog &&
  ultimoLog.status === "Entrada"
){
  statusAtual = "Saída";
}

// Salva novo log
const { error: logError } =
  await supabaseClient
    .from("logs")
    .insert([{
      aluno: aluno.nome,
      status: statusAtual,
      horario: new Date().toISOString()
    }]);

if(logError){

  console.log(logError);

  alert(JSON.stringify(logError));

}else{

  console.log("Log criado!");

}

    } // fecha o FOR

}catch(error){

  console.log(error);

}finally{

  reconhecendo = false;

}

}

function pararMonitor(){

  if(monitorInterval){

    clearInterval(monitorInterval);

    monitorInterval = null;

  }

}