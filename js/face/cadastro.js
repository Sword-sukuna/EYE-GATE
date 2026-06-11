// =========================
// 👥 CADASTRO ALUNO
// =========================
function iniciarCadastro(){

  const btn =
    document.querySelector(".cadastro-btn");

  if(!btn) return;

  btn.addEventListener(

    "click",

    async ()=>{

      await cadastrarAluno();

    }

  );

}

// =========================
// 💾 CADASTRAR ALUNO
// =========================
async function cadastrarAluno(){

  mostrarLoading("Cadastrando aluno...");

  try{

    const nome =
      document
        .getElementById("nome")
        .value
        .trim();

    const matricula =
      document
        .getElementById("matricula")
        .value
        .trim();

    const turma =
      document
        .getElementById("turma")
        .value
        .trim();

    const foto =
      localStorage.getItem(
        "fotoTempAluno"
      );

    const descriptor =
      JSON.parse(

        localStorage.getItem(
          "faceDescriptorTemp"
        )

      );

    if(!nome || !matricula || !turma){

      mostrarMensagem(
        "Preencha todos os campos"
      );

      return;

    }

    if(
 !foto ||
 !descriptor ||
 descriptor.length < 5
)
{
 mostrarMensagem(
   "Capture 5 posições do rosto"
 );
 return;
}

    const { error } =
      await supabaseClient

        .from("alunos")

        .insert([{

          nome,
          matricula,
          turma,
          foto,
          descriptor

        }]);

    if(error){

      console.log(error);

      mostrarMensagem(
        "Erro ao cadastrar"
      );

      return;

    }

    mostrarMensagem(
      "Aluno cadastrado"
    );

    await carregarAlunosCache();
    
    descriptorsTemp = [];
etapaCaptura = 0;

    const instrucao =
document.getElementById(
  "instrucaoFace"
);

if(instrucao){
  instrucao.innerText = poses[0];
}

const barra =
document.getElementById(
  "faceProgress"
);

if(barra){
  barra.style.width = "0%";
}

localStorage.removeItem(
  "faceDescriptorTemp"
);

    limparCampos();

  }finally{

    esconderLoading();

  }

}

// =========================
// 📸 CAPTURAR FACE
// =========================
async function capturarFace(){
  
  if(!faceapi.nets.faceLandmark68Net.isLoaded){

  alert("Landmark não carregado");

  return;

}

  const barra =
  document.getElementById(
    "faceProgress"
  );

  if(descriptorsTemp.length >= 5){

  mostrarMensagem(
    "Já capturou as 5 posições"
  );

  return;

}

  const video =
    document.getElementById("video");

  if(!video) return;

  console.log(
  "Landmark:",
  faceapi.nets.faceLandmark68Net.isLoaded
);

  const detection =
  await faceapi
    .detectSingleFace(

      video,

      new faceapi.TinyFaceDetectorOptions({
        inputSize: 320,
        scoreThreshold: 0.5
      })

    )
    .withFaceLandmarks()
    .withFaceDescriptor();

 if(!detection){

  mostrarMensagem(
    "Nenhum rosto detectado"
  );

  return;

}

if(!validarPose(detection)){

  mostrarMensagem(
    poses[etapaCaptura]
  );

  return;
}

descriptorsTemp.push(
  Array.from(detection.descriptor)
);

etapaCaptura++;

if(barra){
   barra.style.width = 
   `${descriptorsTemp.length * 20}%`;
   }

const instrucao =
  document.getElementById(
    "instrucaoFace"
  );

if(instrucao){

  if(etapaCaptura < poses.length){

    instrucao.innerText =
      poses[etapaCaptura];

  }else{

    instrucao.innerText =
      "Cadastro concluído ✅";

  }

}

localStorage.setItem(
  "faceDescriptorTemp",
  JSON.stringify(descriptorsTemp)
);

  const canvas =
    document.createElement("canvas");

  canvas.width =
    video.videoWidth;

  canvas.height =
    video.videoHeight;

  const ctx =
    canvas.getContext("2d");

  ctx.drawImage(

    video,

    0,

    0,

    canvas.width,

    canvas.height

  );

  const foto =
    canvas.toDataURL("image/png");

  localStorage.setItem(
    "fotoTempAluno",
    foto
  );

  localStorage.setItem(
  "faceDescriptorTemp",
  JSON.stringify(
    descriptorsTemp
  )
);

mostrarMensagem(
  `Amostra ${descriptorsTemp.length}/5 capturada`
);

}

// =========================
// 🧹 LIMPAR
// =========================
function limparCampos(){

  document.getElementById("nome").value = "";

  document.getElementById("matricula").value = "";

  document.getElementById("turma").value = "";

}
