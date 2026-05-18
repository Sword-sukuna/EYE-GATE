// =========================
// ☁ SUPABASE
// =========================
const SUPABASE_URL =
  "https://rhopvipdkeawvejztzix.supabase.co/rest/v1/";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJob3B2aXBka2Vhd3Zlanp0eml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTUxNDUsImV4cCI6MjA5NDY5MTE0NX0.U7NAbG461jLbeSqwkP6gecHFg1UoNDkKY4mUH29NtYA";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

// =========================
// 👁 FACE API
// =========================
let faceMatcher = null;


// =========================
// 🔐 ADMIN FIXO
// =========================
const ADMIN_FIXO = {

  email:"Raul@ADM.local",

  senha:"Silvano@rosa10",

  tipo:"admin",

  nome:"Administrador"

};


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

    iniciarMonitor();

    await iniciarCameraCadastro();

    await iniciarCameraMonitor();

    carregarUsuario();

    controlarPermissoes();

    verificarAdmin();

    await carregarStats();

    await carregarUsuarios();

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

  const paginas =
    document.querySelectorAll(".page");

  paginas.forEach((pagina)=>{

    pagina.classList.remove("active-page");

  });

  const paginaAtual =
    document.getElementById(id);

  if(paginaAtual){

    paginaAtual.classList.add("active-page");

  }

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

      .select("*")

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

}


// =========================
// 🔐 LOGIN ADMIN
// =========================
async function fazerLoginAdmin(){

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

  if(

    email !== ADMIN_FIXO.email ||

    senha !== ADMIN_FIXO.senha

  ){

    mostrarMensagem(
      "Acesso negado"
    );

    return;

  }

  localStorage.setItem(

    "usuarioLogado",

    JSON.stringify(ADMIN_FIXO)

  );

  carregarUsuario();

  controlarPermissoes();

  verificarAdmin();

  await carregarStats();

  await carregarUsuarios();

  mostrarMensagem(
    "Bem-vindo Admin!"
  );

  abrirPagina("dashboardPage");

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

  const totalUsers =
    document.getElementById("totalUsers");

  if(!totalUsers) return;

  const { data, error } =
    await supabaseClient

      .from("usuarios")

      .select("*");

  if(error){

    console.log(error);

    return;

  }

  totalUsers.innerText =
    data.length;

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

  const panel =
    document.getElementById("adminPage");

  if(!panel) return;

  const user =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  if(!user || user.tipo !== "admin"){

    panel.style.display = "none";

  }else{

    panel.style.display = "block";

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

      .select("*");

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

  await carregarStats();

}


// =========================
// 👥 CADASTRO ALUNO
// =========================
function iniciarCadastro(){

  const btn =
    document.querySelector(".cadastro-btn");

  if(!btn) return;

}


// =========================
// 💾 CADASTRAR ALUNO
// =========================
async function cadastrarAluno(){

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

  if(!foto || !descriptor){

    mostrarMensagem(
      "Capture a face primeiro"
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

  limparCampos();

}


// =========================
// 📷 CAMERA CADASTRO
// =========================
async function iniciarCameraCadastro(){

  const video =
    document.getElementById("video");

  if(!video) return;

  try{

    const stream =
      await navigator.mediaDevices.getUserMedia({

        video:true,

        audio:false

      });

    video.srcObject =
      stream;

  }catch(error){

    console.log(error);

  }

}


// =========================
// 📷 CAMERA MONITOR
// =========================
async function iniciarCameraMonitor(){

  const video =
    document.getElementById("monitorVideo");

  if(!video) return;

  try{

    const stream =
      await navigator.mediaDevices.getUserMedia({

        video:true,

        audio:false

      });

    video.srcObject =
      stream;

  }catch(error){

    console.log(error);

  }

}


// =========================
// 📸 CAPTURAR FACE
// =========================
async function capturarFace(){

  const video =
    document.getElementById("video");

  if(!video) return;

  const detection =
    await faceapi

      .detectSingleFace(

        video,

        new faceapi.TinyFaceDetectorOptions()

      )

      .withFaceLandmarks()

      .withFaceDescriptor();

  if(!detection){

    mostrarMensagem(
      "Nenhum rosto detectado"
    );

    return;

  }

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
      Array.from(
        detection.descriptor
      )
    )

  );

  mostrarMensagem(
    "Face capturada"
  );

}


// =========================
// 👁 MONITOR
// =========================
function iniciarMonitor(){

  setInterval(async ()=>{

    await reconhecerFace();

  },3000);

}


// =========================
// 👁 RECONHECER FACE
// =========================
async function reconhecerFace(){

  const video =
    document.getElementById(
      "monitorVideo"
    );

  if(!video) return;

  const { data:alunos } =
    await supabaseClient

      .from("alunos")

      .select("*");

  if(!alunos || alunos.length === 0)
    return;

  const labeledDescriptors =
    alunos.map((aluno)=>{

      return new faceapi.LabeledFaceDescriptors(

        aluno.nome,

        [

          new Float32Array(
            aluno.descriptor
          )

        ]

      );

    });

  faceMatcher =
    new faceapi.FaceMatcher(

      labeledDescriptors,

      0.6

    );

  const detection =
    await faceapi

      .detectSingleFace(

        video,

        new faceapi.TinyFaceDetectorOptions()

      )

      .withFaceLandmarks()

      .withFaceDescriptor();

  if(!detection)
    return;

  const resultado =
    faceMatcher.findBestMatch(
      detection.descriptor
    );

  const aluno =
    alunos.find(

      a => a.nome === resultado.label

    );

  if(aluno){

    mostrarMensagem(
      `Aluno reconhecido: ${aluno.nome}`
    );

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