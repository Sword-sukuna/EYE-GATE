// =========================
// 👁 EYE GATE SYSTEM
// =========================


// =========================
// 🚀 START
// =========================
window.addEventListener("DOMContentLoaded", ()=>{

  protegerAcesso();

  iniciarLogin();

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

  controlarMenu();

  verificarAdmin();

});


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
// 🔐 PROTEGER
// =========================
function protegerAcesso(){

  const precisaLogin =
    document.body.classList.contains("private-page");

  if(!precisaLogin) return;

  const user =
    JSON.parse(localStorage.getItem("usuarioLogado"));

  if(!user){

    window.location.href = "./login.html";

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
// 🚪 LOGIN
// =========================
function fazerLogin(){

  const email =
    document.getElementById("email").value.trim();

  const senha =
    document.getElementById("senha").value.trim();


  if(!email || !senha){

    mostrarMensagem("Preencha todos os campos");

    return;

  }


  // =====================
  // 🔐 ADMIN
  // =====================
  if(

    email === ADMIN_FIXO.email &&

    senha === ADMIN_FIXO.senha

  ){

    localStorage.setItem(

      "usuarioLogado",

      JSON.stringify(ADMIN_FIXO)

    );

    mostrarMensagem("Bem-vindo Admin!");

    window.location.href =
      "./dashboard.html";

    return;

  }


  // =====================
  // 👤 USER
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

    mostrarMensagem("Login realizado");

    window.location.href =
      "./dashboard.html";

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

  const avatar =
    document.querySelector(".user-avatar");


  if(nome){

    nome.innerText = user.nome;

  }


  if(tipo){

    tipo.innerText =

      user.tipo === "admin"

      ? "Administrador"

      : "Usuário";

  }


  if(avatar && user.foto){

    avatar.innerHTML = `

      <img
        src="${user.foto}"
        style="
          width:100%;
          height:100%;
          object-fit:cover;
          border-radius:50%;
        "
      >

    `;

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

  window.location.href =
    "./login.html";

}


// =========================
// 🔐 ADMIN PANEL
// =========================
function verificarAdmin(){

  const panel =
    document.getElementById("adminPanel");

  if(!panel) return;


  const user =
    JSON.parse(localStorage.getItem("usuarioLogado"));


  if(!user || user.tipo !== "admin"){

    panel.style.display = "none";

  }

}


// =========================
// 🔐 TOGGLE PANEL
// =========================
function toggleAdminPanel(){

  const panel =
    document.getElementById("adminPanel");

  if(!panel) return;


  const user =
    JSON.parse(localStorage.getItem("usuarioLogado"));


  if(!user || user.tipo !== "admin"){

    mostrarMensagem("Acesso negado");

    return;

  }


  panel.classList.toggle("show");

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

          <span>
            Sistema vazio
          </span>

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

  mostrarMensagem("Usuário removido");

}


// =========================
// 👁 MENU ADMIN
// =========================
function controlarPermissoes(){

  const user =
    JSON.parse(localStorage.getItem("usuarioLogado"));

  if(!user) return;


  if(user.tipo === "admin"){

    const itens =
      document.querySelectorAll(".admin-only");

    itens.forEach((el)=>{

      el.style.display = "block";

    });

  }

}


// =========================
// 📂 MENU
// =========================
function controlarMenu(){

  const user =
    JSON.parse(localStorage.getItem("usuarioLogado"));

  if(!user) return;


  const isAdmin =
    user.tipo === "admin";


  if(!isAdmin){

    const adminLinks =
      document.querySelectorAll(".admin-only");

    adminLinks.forEach((el)=>{

      el.style.display = "none";

    });

  }

}


// =========================
// 👥 CADASTRO
// =========================
function iniciarCadastro(){

  const btn =
    document.querySelector(".cadastro-btn");

  if(!btn) return;

  btn.addEventListener("click", cadastrarAluno);

}


// =========================
// 💾 CADASTRAR
// =========================
function cadastrarAluno(){

  const nome =
    document.getElementById("nome")?.value.trim();

  const matricula =
    document.getElementById("matricula")?.value.trim();

  const turma =
    document.getElementById("turma")?.value.trim();


  if(!nome || !matricula || !turma){

    mostrarMensagem("Preencha todos os campos");

    return;

  }


  const aluno = {

    id:Date.now(),

    nome,

    matricula,

    turma

  };


  const alunos =
    JSON.parse(localStorage.getItem("alunosEyeGate")) || [];


  alunos.push(aluno);


  localStorage.setItem(

    "alunosEyeGate",

    JSON.stringify(alunos)

  );


  limparCampos();

  carregarAlunos();

  mostrarMensagem("Aluno cadastrado");

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


  if(alunos.length === 0){

    lista.innerHTML = `

      <div class="aluno-item">

        <div class="aluno-info">

          <div class="aluno-avatar">
            👤
          </div>

          <div>

            <strong>
              Nenhum aluno
            </strong>

            <p>
              Sistema vazio
            </p>

          </div>

        </div>

      </div>

    `;

    return;

  }


  alunos.forEach((aluno)=>{

    lista.innerHTML += `

      <div class="aluno-item">

        <div class="aluno-info">

          <div class="aluno-avatar">
            👤
          </div>

          <div>

            <strong>
              ${aluno.nome}
            </strong>

            <p>

              ${aluno.turma}

              •

              ${aluno.matricula}

            </p>

          </div>

        </div>

      </div>

    `;

  });

}


// =========================
// 🧹 LIMPAR
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
// 👁 MONITOR
// =========================
function iniciarMonitor(){

  const logs =
    document.querySelector(".logs-list");

  if(!logs) return;


  iniciarRelogio();

  iniciarSimulacao();

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

      <div class="log-icon">
        👁
      </div>

      <div>

        <strong>
          ${aluno.nome}
        </strong>

        <p>
          Reconhecimento facial realizado
        </p>

      </div>

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


  const botoes =
    document.querySelectorAll(".config-btn");


  if(botoes[0]){

    botoes[0].addEventListener(

      "click",

      limparRegistros

    );

  }


  if(botoes[1]){

    botoes[1].addEventListener(

      "click",

      resetarAlunos

    );

  }


  if(botoes[2]){

    botoes[2].addEventListener(

      "click",

      resetarSistema

    );

  }

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
// 🗑 LIMPAR LOGS
// =========================
function limparRegistros(){

  if(!confirm("Limpar registros?")) return;

  localStorage.removeItem("logsEyeGate");

  mostrarMensagem("Logs removidos");

}


// =========================
// 👥 RESET ALUNOS
// =========================
function resetarAlunos(){

  if(!confirm("Apagar alunos?")) return;

  localStorage.removeItem("alunosEyeGate");

  carregarAlunos();

  mostrarMensagem("Alunos removidos");

}


// =========================
// ⚠ RESET TOTAL
// =========================
function resetarSistema(){

  if(!confirm("Resetar sistema?")) return;

  localStorage.clear();

  mostrarMensagem("Sistema resetado");


  setTimeout(()=>{

    window.location.href =
      "./index.html";

  },1500);

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