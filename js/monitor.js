// =========================
// 👁 EYE GATE MONITOR
// =========================


// =========================
// 🚀 INICIAR
// =========================
window.addEventListener(

  "DOMContentLoaded",

  ()=>{

    iniciarCamera();

    iniciarRelogio();

    iniciarSimulacao();

  }

);


// =========================
// 📷 CAMERA
// =========================
async function iniciarCamera(){

  const video =
    document.getElementById(
      "monitorVideo"
    );

  try{

    const stream =
      await navigator
      .mediaDevices
      .getUserMedia({

        video:true,
        audio:false

      });

    video.srcObject =
      stream;

  }catch(error){

    console.log(
      "Erro câmera:",
      error
    );

  }

}


// =========================
// 🕒 RELÓGIO
// =========================
function iniciarRelogio(){

  atualizarLogs();

  setInterval(

    atualizarLogs,

    1000

  );

}


// =========================
// 📋 LOGS
// =========================
function atualizarLogs(){

  const agora =
    new Date();

  const hora =
    agora.toLocaleTimeString(
      "pt-BR"
    );

  const ultimo =
    document.querySelector(
      ".log-item span"
    );

  if(ultimo){

    ultimo.innerText =
      hora;

  }

}


// =========================
// 🤖 SIMULAÇÃO
// =========================
function iniciarSimulacao(){

  setInterval(()=>{

    simularReconhecimento();

  },7000);

}


// =========================
// 👁 SIMULAR FACE
// =========================
function simularReconhecimento(){

  const alunos =
    JSON.parse(

      localStorage.getItem(
        "alunosEyeGate"
      )

    ) || [];


  // vazio
  if(alunos.length === 0){

    return;

  }


  // random
  const aluno =
    alunos[
      Math.floor(
        Math.random()
        * alunos.length
      )
    ];


  atualizarReconhecimento(
    aluno
  );

  adicionarLog(
    aluno
  );

}


// =========================
// 🧠 RECONHECIMENTO
// =========================
function atualizarReconhecimento(aluno){

  const nome =
    document.querySelector(
      ".recognition-box h3"
    );

  const texto =
    document.querySelector(
      ".recognition-box p"
    );

  nome.innerText =
    aluno.nome;

  texto.innerText =
    `
      ${aluno.turma}
      •
      ${aluno.matricula}
    `;

}


// =========================
// 📋 ADD LOG
// =========================
function adicionarLog(aluno){

  const lista =
    document.querySelector(
      ".logs-list"
    );

  const agora =
    new Date();

  const hora =
    agora.toLocaleTimeString(
      "pt-BR"
    );


  lista.innerHTML =

    `

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

    `

    +

    lista.innerHTML;

}