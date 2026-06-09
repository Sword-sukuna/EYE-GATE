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

//=============//
// Validar adm //
//=============//
async function validarAdminBanco(){

  const adminId =
    localStorage.getItem("adminLogado");

  if(!adminId)
    return false;

  const { data } =
    await supabaseClient
      .from("admins")
      .select("id")
      .eq("id", adminId)
      .single();

  return !!data;

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

  if(!(await verificarAdminLocal())){

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

  mostrarMensagem(
    "Permita acesso à câmera para continuar."
  );

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

  mostrarMensagem(
    "Permita acesso à câmera para continuar."
  );

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

      const nome = aluno.nome;

contadorFrames[nome] =
  (contadorFrames[nome] || 0) + 1;

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

} // fecha reconhecerFace()

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

  if(!(await verificarAdminLocal())){

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

  if(!(await verificarAdminLocal())){

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

async function verificarAdminLocal(){

  const user =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  if(!user)
    return false;

  const { data } =
    await supabaseClient

      .from("admins")

      .select("email")

      .eq("email", user.email)

      .maybeSingle();

  return !!data;

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

//Buscar alunos 
async function buscarAlunoRelatorio(){

  const busca =
    document
      .getElementById("buscaAluno")
      .value
      .toLowerCase();

  const container =
    document.getElementById("resultadoBusca");

  const { data, error } =
    await supabaseClient
      .from("alunos")
      .select("*");

  if(error){

    console.log(error);
    return;

  }

  const encontrados =
  data.filter(aluno =>

    aluno.nome.toLowerCase().includes(busca) ||

    aluno.matricula.toLowerCase().includes(busca) ||

    aluno.turma.toLowerCase().includes(busca)

  );

  container.innerHTML = "";

  encontrados.forEach(aluno => {

    container.innerHTML += `

      <div class="user-card">

        <div class="info">

          <strong>${aluno.nome}</strong>

          <span>${aluno.turma}</span>

          <span>${aluno.matricula}</span>

        </div>

        <div style="display:flex; gap:10px;">

  <button
    class="login-btn"
    onclick="visualizarPDFAluno('${aluno.nome}')"
  >
    👁 Visualizar
  </button>

  <button
    class="logout-btn"
    onclick="baixarPDFAluno('${aluno.nome}')"
  >
    📥 Baixar
  </button>

</div>

    `;

  });

}

// =========================
// 📄 CRIAR PDF ESTILIZADO
// =========================
async function criarPDFAluno(nomeAluno){

  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF();

  const { data, error } =
    await supabaseClient
      .from("logs")
      .select("*")
      .eq("aluno", nomeAluno)
      .order("horario", {
        ascending:false
      });

  if(error){

    console.log(error);

    return null;

  }

  // =========================
  // 🎨 TOPO
  // =========================
  pdf.setFillColor(20,20,30);

  pdf.rect(
    0,
    0,
    210,
    35,
    "F"
  );

  // =========================
  // 👁 LOGO
  // =========================
  try{

    const logo =
      await carregarLogoBase64();

   pdf.addImage(
  logo,
  "PNG",
  12,
  3,
  38,
  38
);

  }catch(e){

    console.log(
      "Erro logo:",
      e
    );

  }

  // =========================
  // 📝 TITULO
  // =========================
  pdf.setTextColor(
    255,
    255,
    255
  );

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(24);

  pdf.text(
  "EYE Gate",
  50,
  17
);

  pdf.setFontSize(10);

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.text(
  "Sistema Inteligente de Reconhecimento Facial",
  50,
  25
);

  // =========================
  // 🔙 VOLTA PRETO
  // =========================
  pdf.setTextColor(
    0,
    0,
    0
  );

  // =========================
  // 📋 INFO
  // =========================
  pdf.setFontSize(18);

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.text(
    "RELATÓRIO ESCOLAR",
    20,
    55
  );

  pdf.setDrawColor(180);

  pdf.line(
    20,
    60,
    190,
    60
  );

  pdf.setFontSize(12);

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.text(
    `Aluno: ${nomeAluno}`,
    20,
    75
  );

  pdf.text(
    `Total de registros: ${data.length}`,
    20,
    85
  );

  pdf.text(
    `Emitido em: ${
      new Date().toLocaleString(
        "pt-BR"
      )
    }`,
    20,
    95
  );

  // =========================
  // 📄 SEM REGISTROS
  // =========================
  let y = 115;

  if(data.length === 0){

    pdf.setFontSize(14);

    pdf.text(
      "Nenhum registro encontrado.",
      20,
      y
    );

    return pdf;

  }

  // =========================
  // 📦 LOGS
  // =========================
  data.forEach((log, index)=>{

    if(y > 250){

      pdf.addPage();

      y = 20;

    }

    const dataHora =
      new Date(log.horario);

    const dataFormatada =
      dataHora.toLocaleDateString(
        "pt-BR",
        {
          timeZone:
          "America/Sao_Paulo"
        }
      );

    const horaFormatada =
      dataHora.toLocaleTimeString(
        "pt-BR",
        {
          timeZone:
          "America/Sao_Paulo"
        }
      );

    // caixa
    pdf.setDrawColor(220);

    pdf.roundedRect(
      15,
      y - 5,
      180,
      28,
      3,
      3
    );

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(13);

    pdf.text(
      `${index + 1}. ${log.status}`,
      25,
      y + 5
    );

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(11);

    pdf.text(
  `Data: ${dataFormatada}`,
  25,
  y + 13
);

pdf.text(
  `Hora: ${horaFormatada}`,
  100,
  y + 13
);

    y += 38;

  });

  // =========================
  // 👣 RODAPÉ
  // =========================
  pdf.setFontSize(9);

  pdf.setTextColor(120);

  pdf.text(
    "Gerado automaticamente pelo sistema EYE Gate",
    20,
    290
  );

  return pdf;

}

// =========================
// 🖼 CARREGAR LOGO
// =========================
async function carregarLogoBase64(){

  return new Promise((resolve)=>{

    const img = new Image();

    img.src = "./img/logo.png";

    img.onload = ()=>{

      const canvas =
        document.createElement(
          "canvas"
        );

      canvas.width =
        img.width;

      canvas.height =
        img.height;

      const ctx =
        canvas.getContext("2d");

      ctx.drawImage(
        img,
        0,
        0
      );

      resolve(
        canvas.toDataURL(
          "image/png"
        )
      );

    };

  });

}

// pdf viewr
async function visualizarPDFAluno(nomeAluno){

  const pdf =
    await criarPDFAluno(nomeAluno);

  if(!pdf) return;

  const blob =
    pdf.output("blob");

  const url =
    URL.createObjectURL(blob);

  window.open(url, "_blank");

}

// download pdf
async function baixarPDFAluno(nomeAluno){

  const pdf =
    await criarPDFAluno(nomeAluno);

  if(!pdf) return;

  pdf.save(
    `${nomeAluno}_relatorio.pdf`
  );

}

//================//
// Iniciar sessão //
//================//
function verificarSessao(){

 try{

  const user =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  if(!user)
    return;

  carregarUsuario();

  controlarPermissoes();

  abrirPagina(
    "dashboardPage"
  );

 }catch{

  localStorage.removeItem(
    "usuarioLogado"
  );

 }

}
