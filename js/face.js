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

// =========================
// 🔐 ADMIN PANEL
// =========================
function verificarAdmin(){

  const user =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  const itens =
    document.querySelectorAll(".admin-only");

  itens.forEach((el)=>{

    el.style.display = "none";

  });

  if(user && user.tipo === "admin"){

    itens.forEach((el)=>{

      el.style.display = "block";

    });

  }

}


// =========================
// 🔐 ADMIN ONLY
// =========================
function controlarPermissoes(){

  const user =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  const itens =
    document.querySelectorAll(".admin-only");

  itens.forEach((el)=>{

    el.style.display = "none";

  });

  if(user && user.tipo === "admin"){

    itens.forEach((el)=>{

      el.style.display = "block";

    });

  }

}


// =========================
// 👥 ADMIN USERS
// =========================
async function carregarUsuarios(){

  const container =
    document.getElementById("adminUsers");

  if(!container) return;

  const { data:users, error } =
    await supabaseClient

      .from("usuarios")

     .select("id,nome,email");

  if(error){

    console.log(error);

    return;

  }

  container.innerHTML = "";

  users.forEach((u)=>{

    const card =
      document.createElement("div");

    card.className =
      "user-card";

    card.innerHTML = `

      <div class="info">

        <strong>
          ${u.nome}
        </strong>

        <span>
          ${u.email}
        </span>

      </div>

      <button
        class="delete-btn"
        onclick="deletarUsuario('${u.id}')"
      >
        🗑
      </button>

    `;

    container.appendChild(card);

  });

}


// =========================
// 🗑 DELETE USER
// =========================
async function deletarUsuario(id){

  if(!verificarAdminLocal()){

  mostrarMensagem(
    "Sem permissão"
  );

  return;

}

  if(!confirm("Deseja deletar?"))
    return;

  const { error } =
    await supabaseClient

      .from("usuarios")

      .delete()

      .eq("id", id);

  if(error){

    console.log(error);

    mostrarMensagem(
      "Erro ao deletar"
    );

    return;

  }

  mostrarMensagem(
    "Usuário removido"
  );

  await carregarUsuarios();

  await carregarLogs();

  await carregarStats();

}


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
// 📷 CAMERA CADASTRO
// =========================
async function iniciarCameraCadastro(){

 const video =
 document.getElementById("video");

 if(!video)
   return;

 if(streamCadastro)
   return;

 try{

   streamCadastro =
   await navigator.mediaDevices.getUserMedia({

     video:true,

     audio:false

   });

   video.srcObject =
   streamCadastro;

 }catch(error){

   console.log(error);

 }

}


// =========================
// 📷 CAMERA MONITOR
// =========================
async function iniciarCameraMonitor(){

 const video =
 document.getElementById(
   "monitorVideo"
 );

 if(!video)
   return;

 if(streamMonitor)
   return;

 try{

   streamMonitor =
   await navigator.mediaDevices.getUserMedia({

     video:true,

     audio:false

   });

   video.srcObject =
   streamMonitor;

 }catch(error){

   console.log(error);

 }

}

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
// 👁 MONITOR
// =========================
let monitorInterval = null;

function iniciarMonitor(){

  if(monitorInterval)
    return;

  monitorInterval = setInterval(
    reconhecerFace,
    100
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
        inputSize:416,
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

const nome = resultado.label;

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

      const aluno =
        alunosCache.find(
          a => a.nome === resultado.label
        );

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

    const { error } =
  await supabaseClient
    .from("logs")
    .insert([{
      aluno: aluno.nome,
      status: "Reconhecido",
     horario: new Date().toLocaleString(
  "sv-SE",
  {
    timeZone: "America/Sao_Paulo"
  }
)
    }]);

if(error){

  console.log(error);

  alert(JSON.stringify(error));

}else{

  console.log("Log criado!");

}

}

  }catch(error){

    console.log(error);

  }finally{

    reconhecendo = false;

  }

}


// =========================
// 🧹 LIMPAR
// =========================
function limparCampos(){

  document.getElementById("nome").value = "";

  document.getElementById("matricula").value = "";

  document.getElementById("turma").value = "";

}

function logSistema(tipo, mensagem){

  const registro = {

    horario: new Date().toLocaleTimeString(),

    tipo,

    mensagem

  };

  window.debugLogs.push(registro);

  console.log(
    `[${tipo}]`,
    mensagem
  );

}
logSistema(
  "TESTE",
  "Sistema iniciado"
);

// =========================
// 📋 CARREGAR LOGS
// =========================
async function carregarLogs(){

  const tabela =
    document.getElementById("logsTable");

  if(!tabela) return;

  const { data, error } =
    await supabaseClient

      .from("logs")

      .select("id,aluno,status,horario")

      .order("horario", {
        ascending:false
      });

  if(error){

    console.log(error);

    return;

  }

  tabela.innerHTML = "";

  data.forEach((log)=>{

  const horario = new Date(log.horario)
.toLocaleString("pt-BR", {
  timeZone: "America/Sao_Paulo"
});

    tabela.innerHTML += `

      <tr>

       <td>${log.aluno}</td>

        <td>${log.status}</td>

        <td>${horario}</td>

      </tr>

    `;

  });

}

//KEEP_LIVE//

async function keepAlive() {

  try {

    const { error } =
      await supabaseClient

        .from("usuarios")

        .select("id")

        .limit(1);

    if(error){

      console.log(
        "keep-alive erro:",
        error.message
      );

    }else{

      console.log(
        "💚 keep-alive ok"
      );

    }

  }catch(e){

    console.log(
      "keep-alive falhou",
      e
    );

  }

}

// 30 minutos
setInterval(keepAlive, 1000 * 60 * 30);

// roda uma vez ao iniciar também
keepAlive();

// =========================
// 🎓 ADMIN ALUNOS
// =========================
async function carregarAlunosAdmin(){

  const container =
    document.getElementById("adminAlunos");

  if(!container) return;

  const { data, error } =
    await supabaseClient

      .from("alunos")

      .select("*");

  if(error){

    console.log(error);

    return;

  }

  container.innerHTML = "";

  data.forEach((aluno)=>{

    container.innerHTML += `

      <div class="user-card">

        <div class="info">

          <strong>
            ${aluno.nome}
          </strong>

          <span>
            ${aluno.turma}
          </span>

          <span>
            ${aluno.matricula}
          </span>

        </div>

        <button
          class="delete-btn"
          onclick="deletarAluno('${aluno.id}')"
        >
          🗑 Excluir
        </button>

      </div>

    `;

  });

}

// =========================
// 🗑 DELETE ALUNO
// =========================
async function deletarAluno(id){

  if(!verificarAdminLocal()){

  mostrarMensagem(
    "Sem permissão"
  );

  return;

}

  if(!confirm("Excluir aluno?"))
    return;

  const { error } =
    await supabaseClient

      .from("alunos")

      .delete()

      .eq("id", id);

  if(error){

    console.log(error);

    mostrarMensagem(
      "Erro ao excluir"
    );

    return;

  }

  mostrarMensagem(
    "Aluno removido"
  );

  await carregarAlunosAdmin();

  await carregarStats();

}

// =========================
// 📋 ADMIN LOGS
// =========================
async function carregarLogsAdmin(){

  const container =
    document.getElementById("adminLogs");

  if(!container) return;

  const { data, error } =
    await supabaseClient

      .from("logs")

      .select("*")

      .order("horario",{
        ascending:false
      });

  if(error){

    console.log(error);

    return;

  }

  container.innerHTML = "";

  data.forEach((log)=>{

    container.innerHTML += `

      <div class="user-card">

        <div class="info">

          <strong>
            ${log.aluno}
          </strong>

          <span>
            ${log.status}
          </span>

        </div>

        <button
          class="delete-btn"
          onclick="deletarLog('${log.id}')"
        >
          🗑 Excluir
        </button>

      </div>

    `;

  });

}

// =========================
// 🗑 DELETE LOG
// =========================
async function deletarLog(id){

  if(!verificarAdminLocal()){

  mostrarMensagem(
    "Sem permissão"
  );

  return;

}

  if(!confirm("Excluir registro?"))
    return;

  const { error } =
    await supabaseClient

      .from("logs")

      .delete()

      .eq("id", id);

  if(error){

    console.log(error);

    mostrarMensagem(
      "Erro ao excluir"
    );

    return;

  }

  mostrarMensagem(
    "Registro removido"
  );

  await carregarLogsAdmin();

  await carregarStats();

}

// =========================
// 📈 GRAFICO LOGS
// =========================
async function carregarGraficoLogs(){

  const existente =
Chart.getChart("graficoLogs");

if(existente){
  existente.destroy();
}

  const canvas =
    document.getElementById("graficoLogs");

  if(!canvas) return;

  const { data, error } =
    await supabaseClient

      .from("logs")

      .select("horario");

  if(error){

    console.log(error);

    return;

  }

  const dias = {};

  data.forEach((log)=>{

    const dia =
      new Date(log.horario)
      .toLocaleDateString("pt-BR");

    dias[dia] = (dias[dia] || 0) + 1;

  });

if(graficoLogs){
  graficoLogs.destroy();
}

graficoLogs = new Chart(canvas,{

  type: "line",

  data: {

    labels: Object.keys(dias),

    datasets:[{

      label:"Reconhecimentos",

      data:Object.values(dias),

      borderColor:"#6C5CE7",

      backgroundColor:"rgba(108,92,231,0.2)",

      borderWidth:3,

      tension:0.4,

      fill:true,

      pointRadius:5,

      pointHoverRadius:8

    }]

  },

  options: {

    responsive:true,

    maintainAspectRatio:false,

    plugins:{

      legend:{

        labels:{

          color:"#fff"

        }

      }

    },

    scales:{

      x:{

        ticks:{

          color:"#aaa"

        },

        grid:{

          color:"rgba(255,255,255,0.05)"

        }

      },

      y:{

        ticks:{

          color:"#aaa"

        },

        grid:{

          color:"rgba(255,255,255,0.05)"

        }

      }

    }

  }

});

}

lucide.createIcons();

function verificarAdminLocal(){

  const user =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  return user && user.tipo === "admin";

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

  console.log(
    "Alunos carregados:",
    alunosCache.length
  );

  const labeledDescriptors =
    alunosCache.map((aluno)=>{

      return new faceapi.LabeledFaceDescriptors(
  aluno.nome,
  aluno.descriptor.map(
    d => new Float32Array(d)
  )
)

    });

    if(labeledDescriptors.length === 0){

  console.log("Nenhum aluno cadastrado");

  matcherPronto = false;

  return;

}

  faceMatcher =
    new faceapi.FaceMatcher(

      labeledDescriptors,

      0.65

    );

  matcherPronto = true;

  console.log(
  "FaceMatcher carregado"
);

console.log(
  "Alunos:",
  alunosCache
);

}

function pararCameraCadastro(){

 if(!streamCadastro)
   return;

 streamCadastro
   .getTracks()
   .forEach(track => track.stop());

 streamCadastro = null;

}

function pararCameraMonitor(){

 if(!streamMonitor)
   return;

 streamMonitor
   .getTracks()
   .forEach(track => track.stop());

 streamMonitor = null;

}

function pararMonitor(){

  if(monitorInterval){

    clearInterval(monitorInterval);

    monitorInterval = null;

  }
  // =========================
// 🧹 LIMPAR LOGS ANTIGOS (DIÁRIO)
// =========================
async function limparLogsAntigos() {
    try {
        const hoje = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD

        // Apaga todos os logs onde a data é ANTERIOR a hoje
        const { error } = await supabaseClient
            .from("logs")
            .delete()
            .lt("horario", `${hoje}T00:00:00`);

        if (error) {
            console.error("Erro ao limpar logs antigos:", error);
        } else {
            console.log(`✅ Logs antigos (antes de ${hoje}) foram apagados`);
        }
    } catch (e) {
        console.error("Erro na limpeza diária:", e);
    }
}
// ====================== AUTO LIMPEZA DIÁRIA ======================
async function iniciarLimpezaDiaria() {
    await limparLogsAntigos(); // Limpa ao carregar a página

    // Verifica a cada 5 minutos se mudou o dia
    setInterval(async () => {
        const agora = new Date();
        const hora = agora.getHours();
        const minuto = agora.getMinutes();

        // Executa à meia-noite ou logo no início do dia
        if (hora === 0 && minuto < 10) {
            await limparLogsAntigos();
        }
    }, 300000); // 5 minutos
}

// Inicia a limpeza automática
iniciarLimpezaDiaria();

}