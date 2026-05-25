// =========================
// ☁ SUPABASE
// =========================
const SUPABASE_URL =
  "https://rhopvipdkeawvejztzix.supabase.co";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJob3B2aXBka2Vhd3Zlanp0eml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTUxNDUsImV4cCI6MjA5NDY5MTE0NX0.U7NAbG461jLbeSqwkP6gecHFg1UoNDkKY4mUH29NtYA";

const supabaseClient = window.supabase?.createClient?.(
  SUPABASE_URL,
  SUPABASE_KEY
);

if (!supabaseClient) {
  console.error("Supabase não carregou");
}

// =========================
// 👁 FACE API
// =========================
let streamCadastro = null;

let streamMonitor = null;

let faceMatcher = null;

let alunosCache = [];

let matcherPronto = false;

let reconhecendo = false;

let descriptorsTemp = [];

let capturaAuto = null;

const ultimoReconhecimento = {};

const TEMPO_BLOQUEIO = 10 * 60 * 1000;

const debugLogs = [];

const poses = [
  "Olhe para frente 👀",
  "Vire para a esquerda ↩️",
  "Vire para a direita ↪️",
  "Olhe para cima ⬆️",
  "Olhe para baixo ⬇️"
];

let etapaCaptura = 0;

// =========================
// 🚀 START
// =========================
window.addEventListener(

  "DOMContentLoaded",

  async ()=>{

    await carregarFaceAPI();

    iniciarLogin();

    iniciarAdminLogin();

    iniciarRegistro();

    iniciarCadastro();

    await carregarAlunosCache();

    carregarUsuario();

    controlarPermissoes();

    await carregarGraficoLogs();

    await carregarStats();

    await carregarUsuarios();

    await carregarLogs();

  }

);


// =========================
// 👁 FACE API
// =========================
async function carregarFaceAPI(){

  try{

    await faceapi.nets.tinyFaceDetector.loadFromUri("./models");

    await faceapi.nets.faceLandmark68Net.loadFromUri("./models");

    await faceapi.nets.faceRecognitionNet.loadFromUri("./models");

    console.log("Face API carregada");

  }catch(error){

    console.log(error);

  }

}


// =========================
// 📄 TROCAR PÁGINA
// =========================
function abrirPagina(id){

  pararCameraCadastro();

pararCameraMonitor();

pararMonitor();

  mostrarLoading("Abrindo página...");

  setTimeout(()=>{

    if(

      id === "adminPage" &&

      !verificarAdminLocal()

    ){

      mostrarMensagem(
        "Acesso negado"
      );

      esconderLoading();

      return;

    }

    document
      .querySelectorAll(".page")
      .forEach(page => {

        page.classList.remove("active-page");

      });

    document
      .getElementById(id)
      .classList.add("active-page");

    esconderLoading();

    if(id === "cadastroPage"){

 iniciarCameraCadastro();

}

if(id === "monitorPage"){

  iniciarCameraMonitor();
  iniciarMonitor();

}

  },500);

}


// =========================
// 👁 LOGIN
// =========================
function iniciarLogin(){

  const form =
    document.getElementById("loginForm");

  if(!form) return;

  form.addEventListener(

    "submit",

    async (e)=>{

      e.preventDefault();

      await fazerLogin();

    }

  );

}


// =========================
// 🔐 LOGIN ADMIN
// =========================
function iniciarAdminLogin(){

  const form =
    document.getElementById("adminForm");

  if(!form) return;

  form.addEventListener(

    "submit",

    async (e)=>{

      e.preventDefault();

      await fazerLoginAdmin();

    }

  );

}


// =========================
// 📝 REGISTRO
// =========================
function iniciarRegistro(){

  const form =
    document.getElementById("registroForm");

  if(!form) return;

  form.addEventListener(

    "submit",

    async (e)=>{

      e.preventDefault();

      await registrarUsuario();

    }

  );

}


// =========================
// 👤 REGISTRAR USUÁRIO
// =========================
async function registrarUsuario(){

  const nome =
    document
      .getElementById("registroNome")
      .value
      .trim();

  const email =
    document
      .getElementById("registroEmail")
      .value
      .trim();

  const senha =
    document
      .getElementById("registroSenha")
      .value
      .trim();

  if(!nome || !email || !senha){

    mostrarMensagem(
      "Preencha todos os campos"
    );

    return;

  }

  const { data:existe } =
    await supabaseClient

      .from("usuarios")

      .select("id")

      .eq("email", email);

  if(existe && existe.length > 0){

    mostrarMensagem(
      "Email já cadastrado"
    );

    return;

  }

  const { error } =
    await supabaseClient

      .from("usuarios")

      .insert([{

        nome,
        email,
        senha,
        tipo:"usuario"

      }]);

  if(error){

    console.log(error);

    mostrarMensagem(
      "Erro ao cadastrar"
    );

    return;

  }

  mostrarMensagem(
    "Conta criada"
  );

  abrirPagina("loginPage");

}


// =========================
// 🚪 LOGIN USER
// =========================
async function fazerLogin(){

  mostrarLoading("Entrando...");

  try{

    const email =
      document
        .getElementById("email")
        .value
        .trim();

    const senha =
      document
        .getElementById("senha")
        .value
        .trim();

    if(!email || !senha){

      mostrarMensagem(
        "Preencha os campos"
      );

      return;

    }

    const { data:user, error } =
      await supabaseClient

        .from("usuarios")

       .select("*")

        .eq("email", email)

        .eq("senha", senha)

        .maybeSingle();

    if(error || !user){

      mostrarMensagem(
        "Login inválido"
      );

      return;

    }

    localStorage.setItem(

      "usuarioLogado",

      JSON.stringify(user)

    );

    carregarUsuario();

    controlarPermissoes();

    await carregarStats();

    mostrarMensagem(
      "Login realizado"
    );

    abrirPagina("dashboardPage");

  }finally{

    esconderLoading();

  }

}


// =========================
// 🔐 LOGIN ADMIN
// =========================
async function fazerLoginAdmin(){

  mostrarLoading("Entrando como admin...");

  try{

    const email =
      document
        .getElementById("adminEmail")
        .value
        .trim();

    const senha =
      document
        .getElementById("adminSenha")
        .value
        .trim();

    const { data:admin, error } =
      await supabaseClient

        .from("admins")

        .select("*")

        .eq("email", email)

        .eq("senha", senha)

        .maybeSingle();

    if(error || !admin){

      mostrarMensagem(
        "Acesso negado"
      );

      return;

    }

    localStorage.setItem(

      "usuarioLogado",

      JSON.stringify({

        nome:"Administrador",

        tipo:"admin",

        email:admin.email

      })

    );

    carregarUsuario();

    controlarPermissoes();

    verificarAdmin();

    await carregarStats();

    await carregarAlunosAdmin();

    await carregarLogsAdmin();

    await carregarUsuarios();

    await carregarLogs();

    mostrarMensagem(
      "Bem-vindo Admin!"
    );

    abrirPagina("dashboardPage");

  }finally{

    esconderLoading();

  }

}

// =========================
// 👤 USER INFO
// =========================
function carregarUsuario(){

  const user =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  if(!user) return;

  const nome =
    document.getElementById("userName");

  const tipo =
    document.getElementById("userType");

  if(nome){

    nome.innerText =
      user.nome;

  }

  if(tipo){

    tipo.innerText =

      user.tipo === "admin"

      ? "Administrador"

      : "Usuário";

  }

}


// =========================
// 📊 STATS
// =========================
async function carregarStats(){

  // USERS
  const {
    data:usuarios
  } = await supabaseClient

    .from("usuarios")
   .select("id");

  // ALUNOS
  const {
    data:alunos
  } = await supabaseClient

    .from("alunos")
   .select("id");

  // LOGS
  const {
    data:logs
  } = await supabaseClient

    .from("logs")
   .select("id");

  // USERS
  const totalUsers =
    document.getElementById(
      "totalUsers"
    );

  if(totalUsers){

    totalUsers.innerText =
      usuarios?.length || 0;

  }

  // ALUNOS
  const totalAlunos =
    document.getElementById(
      "totalAlunos"
    );

  if(totalAlunos){

    totalAlunos.innerText =
      alunos?.length || 0;

  }

  // RECONHECIMENTOS
  const totalReconhecimentos =
    document.getElementById(
      "totalReconhecimentos"
    );

  if(totalReconhecimentos){

    totalReconhecimentos.innerText =
      logs?.length || 0;

  }

  // LOGS
  const totalLogs =
    document.getElementById(
      "totalLogs"
    );

  if(totalLogs){

    totalLogs.innerText =
      logs?.length || 0;

  }

}


// =========================
// 🚪 LOGOUT
// =========================
function logout(){

  localStorage.removeItem(
    "usuarioLogado"
  );

  abrirPagina("loginPage");

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
    250
  );

}


// =========================
// 👁 RECONHECER FACE
// =========================
async function reconhecerFace(){

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
        inputSize:224,
        scoreThreshold:0.5
      })
    )
    .withFaceLandmarks()
    .withFaceDescriptors();

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

      if(resultado.label === "unknown"){

  console.log(
    "Desconhecido. Distância:",
    resultado.distance
  );

  continue;
}

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

      console.log("Tentando salvar:", aluno);

    const { error } =
  await supabaseClient
    .from("logs")
    .insert([{
      aluno: aluno.nome,
      status: "Reconhecido",
      horario: new Date().toISOString()
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

  debugLogs.push(registro);

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
// 🍞 TOAST
// =========================
function mostrarMensagem(texto){

  const toast =
    document.querySelector(".toast");

  if(!toast){

    alert(texto);

    return;

  }

  toast.innerText =
    texto;

  toast.classList.add("show");

  setTimeout(()=>{

    toast.classList.remove("show");

  },3000);

}

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

    const horario =
      new Date(log.horario)
      .toLocaleString("pt-BR");

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

  new Chart(canvas, {

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

// =========================
// ⏳ LOADING SYSTEM
// =========================

function mostrarLoading(texto = "Carregando..."){

  const loading =
    document.getElementById(
      "loadingScreen"
    );

  const loadingText =
    document.getElementById(
      "loadingText"
    );

  if(!loading) return;

  loadingText.innerText =
    texto;

  loading.classList.add("show");

}

function esconderLoading(){

  const loading =
    document.getElementById(
      "loadingScreen"
    );

  if(!loading) return;

  loading.classList.remove("show");

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

      0.75

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

setInterval(async () => {

  await carregarStats();

  await carregarLogs();

}, 5000);