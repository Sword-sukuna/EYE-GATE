let faceMatcher;
let facesSalvas = [];

async function carregarFaceAPI(){

  await faceapi.nets.tinyFaceDetector.loadFromUri("./models");

  await faceapi.nets.faceLandmark68Net.loadFromUri("./models");

  await faceapi.nets.faceRecognitionNet.loadFromUri("./models");

  console.log("Face API carregada");

}

// =========================
// 👁 EYE GATE SYSTEM
// =========================


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
window.addEventListener("DOMContentLoaded", ()=>{

  carregarFaceAPI();

  iniciarLogin();

  iniciarAdminLogin();
  
  iniciarCadastroUsuario();

  iniciarRegistro();

  iniciarCadastro();

  iniciarConfiguracoes();

  iniciarMonitor();

  iniciarCameraCadastro();

  iniciarCameraMonitor();

  carregarUsuario();

  carregarStats();

  carregarAlunos();

  carregarUsuarios();

  controlarPermissoes();

  verificarAdmin();

});


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

  form.addEventListener("submit",(e)=>{

    e.preventDefault();

    fazerLogin();

  });

}


// =========================
// 📝 REGISTRO
// =========================
function iniciarRegistro(){

  const form =
    document.getElementById("registroForm");

  if(!form) return;

  form.addEventListener("submit",(e)=>{

    e.preventDefault();

    registrarUsuario();

  });

}


// =========================
// 👤 REGISTRAR
// =========================
function registrarUsuario(){

  const nome =
    document.getElementById("registroNome")?.value.trim();

  const email =
    document.getElementById("registroEmail")?.value.trim();

  const senha =
    document.getElementById("registroSenha")?.value.trim();


  if(!nome || !email || !senha){

    mostrarMensagem("Preencha todos os campos");

    return;

  }


  const usuarios =
    JSON.parse(localStorage.getItem("usuariosEyeGate")) || [];


  const existe =
    usuarios.find(u => u.email === email);


  if(existe){

    mostrarMensagem("Email já cadastrado");

    return;

  }


  const novoUsuario = {

    nome,
    email,
    senha,
    tipo:"usuario"

  };


  usuarios.push(novoUsuario);


  localStorage.setItem(

    "usuariosEyeGate",

    JSON.stringify(usuarios)

  );


  mostrarMensagem("Conta criada com sucesso");

  abrirPagina("loginPage");

}


// =========================
// 🚪 LOGIN
// =========================
function fazerLogin(){

  const email =
    document.getElementById("email")?.value.trim();

  const senha =
    document.getElementById("senha")?.value.trim();


  if(!email || !senha){

    mostrarMensagem("Preencha todos os campos");

    return;

  }


  // =====================
  // 🔐 LOGIN ADMIN
  // =====================
  if(

    email === ADMIN_FIXO.email &&

    senha === ADMIN_FIXO.senha

  ){

    localStorage.setItem(

      "usuarioLogado",

      JSON.stringify(ADMIN_FIXO)

    );


    carregarUsuario();

    carregarStats();

    controlarPermissoes();

    verificarAdmin();

    mostrarMensagem("Bem-vindo Admin!");

    abrirPagina("dashboardPage");

    return;

  }


  // =====================
  // 👤 LOGIN USER
  // =====================
  const usuarios =
    JSON.parse(localStorage.getItem("usuariosEyeGate")) || [];


  const usuario =
    usuarios.find(

      u =>

        u.email === email &&

        u.senha === senha

    );


  if(usuario){

    localStorage.setItem(

      "usuarioLogado",

      JSON.stringify(usuario)

    );


    carregarUsuario();

    carregarStats();

    controlarPermissoes();

    mostrarMensagem("Login realizado");

    abrirPagina("dashboardPage");

    return;

  }


  mostrarMensagem("Email ou senha inválidos");

}


// =========================
// 👤 USER INFO
// =========================
function carregarUsuario(){

  const user =
    JSON.parse(localStorage.getItem("usuarioLogado"));

  if(!user) return;


  const nome =
    document.getElementById("userName");

  const tipo =
    document.getElementById("userType");


  if(nome){

    nome.innerText = user.nome;

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
function carregarStats(){

  const totalUsers =
    document.getElementById("totalUsers");

  if(!totalUsers) return;


  const users =
    JSON.parse(localStorage.getItem("usuariosEyeGate")) || [];


  totalUsers.innerText =
    users.length;

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
    JSON.parse(localStorage.getItem("usuarioLogado"));


  if(!user || user.tipo !== "admin"){

    panel.style.display = "none";

  }else{

    panel.style.display = "block";

  }

}


// =========================
// 👥 ADMIN USERS
// =========================
function carregarUsuarios(){

  const container =
    document.getElementById("adminUsers");

  if(!container) return;


  const users =
    JSON.parse(localStorage.getItem("usuariosEyeGate")) || [];


  container.innerHTML = "";


  if(users.length === 0){

    container.innerHTML = `

      <div class="user-card">

        <div class="info">

          <strong>
            Nenhum usuário
          </strong>

        </div>

      </div>

    `;

    return;

  }


  users.forEach((u,index)=>{

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
        onclick="deletarUsuario(${index})"
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
function deletarUsuario(index){

  const users =
    JSON.parse(localStorage.getItem("usuariosEyeGate")) || [];


  if(!confirm("Deseja deletar?")) return;


  users.splice(index,1);


  localStorage.setItem(

    "usuariosEyeGate",

    JSON.stringify(users)

  );


  carregarUsuarios();

  carregarStats();

  mostrarMensagem("Usuário removido");

}


// =========================
// 🔐 ADMIN ONLY
// =========================
function controlarPermissoes(){

  const user =
    JSON.parse(localStorage.getItem("usuarioLogado"));

  const itens =
    document.querySelectorAll(".admin-only");


  itens.forEach((el)=>{

    el.style.display = "none";

  });


  if(!user) return;


  if(user.tipo === "admin"){

    itens.forEach((el)=>{

      el.style.display = "block";

    });

  }

}


// =========================
// 👥 CADASTRO ALUNO
// =========================
function iniciarCadastro(){

  const btn =
    document.querySelector(".cadastro-btn");

  if(!btn) return;

  btn.addEventListener("click", cadastrarAluno);

}


// =========================
// 💾 CADASTRAR ALUNO
// =========================
function cadastrarAluno(){

  const nome =
    document.getElementById("nome")?.value.trim();

  const matricula =
    document.getElementById("matricula")?.value.trim();

  const turma =
    document.getElementById("turma")?.value.trim();

  const foto =
    localStorage.getItem("fotoTempAluno");

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

  if(!foto){

    mostrarMensagem(
      "Capture uma face"
    );

    return;

  }

  const aluno = {

    id:Date.now(),

    nome,

    matricula,

    turma,

    foto,

    descriptor

  };

  const alunos =
    JSON.parse(
      localStorage.getItem("alunosEyeGate")
    ) || [];

  alunos.push(aluno);

  localStorage.setItem(

    "alunosEyeGate",

    JSON.stringify(alunos)

  );

  mostrarMensagem(
    "Aluno cadastrado"
  );

}


// =========================
// 📋 LISTAR ALUNOS
// =========================
function carregarAlunos(){

  const lista =
    document.querySelector(".alunos-list");

  if(!lista) return;


  const alunos =
    JSON.parse(localStorage.getItem("alunosEyeGate")) || [];


  lista.innerHTML = "";


  alunos.forEach((aluno)=>{

    lista.innerHTML += `

      <div class="aluno-item">

        <strong>
          ${aluno.nome}
        </strong>

        <p>
          ${aluno.turma} • ${aluno.matricula}
        </p>

      </div>

    `;

  });

}


// =========================
// 🧹 LIMPAR CAMPOS
// =========================
function limparCampos(){

  const ids = [

    "nome",

    "matricula",

    "turma"

  ];


  ids.forEach((id)=>{

    const el =
      document.getElementById(id);

    if(el){

      el.value = "";

    }

  });

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
// 📸 CAPTURAR FACE
// =========================
async function capturarFace(){

  const video =
    document.getElementById("video");

  if(!video){

    mostrarMensagem(
      "Vídeo não encontrado"
    );

    return;

  }

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

  // =========================
  // 📷 FOTO
  // =========================
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

  // =========================
  // 🧠 DESCRIPTOR
  // =========================
  const descriptor =
    Array.from(
      detection.descriptor
    );

  localStorage.setItem(

    "fotoTempAluno",

    foto

  );

  localStorage.setItem(

    "faceDescriptorTemp",

    JSON.stringify(descriptor)

  );

  mostrarMensagem(
    "Face capturada"
  );

}

// =========================
// 👁 MONITOR
// =========================
function iniciarMonitor(){

  iniciarRelogio();

  setInterval(()=>{

  reconhecerFace();

},3000);

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
// 🕒 CLOCK
// =========================
function iniciarRelogio(){

  atualizarLogs();

  setInterval(atualizarLogs,1000);

}


// =========================
// 📋 UPDATE LOG TIME
// =========================
function atualizarLogs(){

  const ultimo =
    document.querySelector(".log-item span");

  if(!ultimo) return;


  ultimo.innerText =
    new Date().toLocaleTimeString("pt-BR");

}


// =========================
// 🤖 IA SIMULADA
// =========================
function iniciarSimulacao(){

  setInterval(()=>{

    simularReconhecimento();

  },7000);

}


// =========================
// 👁 SIMULA FACE
// =========================
function simularReconhecimento(){

  const alunos =
    JSON.parse(localStorage.getItem("alunosEyeGate")) || [];


  if(alunos.length === 0) return;


  const aluno =

    alunos[

      Math.floor(

        Math.random()

        * alunos.length

      )

    ];


  atualizarReconhecimento(aluno);

  adicionarLog(aluno);

}


// =========================
// 🧠 UPDATE FACE
// =========================
function atualizarReconhecimento(aluno){

  const nome =
    document.querySelector(".recognition-box h3");

  const texto =
    document.querySelector(".recognition-box p");


  if(nome){

    nome.innerText =
      aluno.nome;

  }


  if(texto){

    texto.innerText = `

      ${aluno.turma}

      •

      ${aluno.matricula}

    `;

  }

}


// =========================
// 📋 ADD LOG
// =========================
function adicionarLog(aluno){

  const lista =
    document.querySelector(".logs-list");

  if(!lista) return;


  const hora =
    new Date().toLocaleTimeString("pt-BR");


  lista.innerHTML = `

    <div class="log-item">

      <strong>
        ${aluno.nome}
      </strong>

      <p>
        Reconhecimento facial realizado
      </p>

      <span>
        ${hora}
      </span>

    </div>

  ` + lista.innerHTML;

}


// =========================
// ⚙ CONFIG
// =========================
function iniciarConfiguracoes(){

  const switches =
    document.querySelectorAll(".switch input");

  if(switches.length === 0) return;


  switches.forEach((item)=>{

    item.addEventListener("change", ()=>{

      salvarConfiguracoes();

    });

  });

}


// =========================
// 💾 SAVE CONFIG
// =========================
function salvarConfiguracoes(){

  const switches =
    document.querySelectorAll(".switch input");


  const config = {

    tema:switches[0]?.checked,

    efeitos:switches[1]?.checked,

    reconhecimento:switches[2]?.checked,

    logs:switches[3]?.checked

  };


  localStorage.setItem(

    "configEyeGate",

    JSON.stringify(config)

  );


  mostrarMensagem("Configuração salva");

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

// =========================
// 🔐 LOGIN ADMIN
// =========================
function iniciarAdminLogin(){

  const form =
    document.getElementById("adminForm");

  if(!form) return;

  form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const email =
      document.getElementById("adminEmail").value.trim();

    const senha =
      document.getElementById("adminSenha").value.trim();


    if(
      email === ADMIN_FIXO.email &&
      senha === ADMIN_FIXO.senha
    ){

      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(ADMIN_FIXO)
      );

      carregarUsuario();

      carregarStats();

      controlarPermissoes();

      mostrarMensagem("Bem-vindo Admin!");

      abrirPagina("dashboardPage");

    }else{

      mostrarMensagem("Acesso negado");

    }

  });

}
// =========================
// 📝 REGISTRO
// =========================
function iniciarCadastroUsuario(){

  const form =
    document.getElementById("registroForm");

  if(!form) return;

  form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const usuarios =
      JSON.parse(localStorage.getItem("usuariosEyeGate")) || [];

    const novoUsuario = {

      nome:
        document.getElementById("registroNome").value,

      email:
        document.getElementById("registroEmail").value,

      senha:
        document.getElementById("registroSenha").value,

      tipo:"usuario"

    };

    usuarios.push(novoUsuario);

    localStorage.setItem(
      "usuariosEyeGate",
      JSON.stringify(usuarios)
    );

    mostrarMensagem("Conta criada!");

    abrirPagina("loginPage");

  });

}

async function reconhecerFace(){

  const video =
    document.getElementById(
      "monitorVideo"
    );

  if(!video) return;

  const alunos =
    JSON.parse(
      localStorage.getItem(
        "alunosEyeGate"
      )
    ) || [];

  if(alunos.length === 0) return;

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

  if(!detection) return;

  const resultado =
    faceMatcher.findBestMatch(
      detection.descriptor
    );

  const aluno =
    alunos.find(

      a => a.nome === resultado.label

    );

  if(aluno){

    atualizarReconhecimento(aluno);

    adicionarLog(aluno);

  }

}