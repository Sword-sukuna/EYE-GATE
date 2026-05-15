// =========================
// 👁 EYE GATE MONITOR
// =========================


// =========================
// 📷 CAMERA
// =========================
const video =
  document.getElementById(
    "video"
  );


// =========================
// 🚀 INICIAR
// =========================
window.addEventListener(

  "DOMContentLoaded",

  async ()=>{

    await iniciarCamera();

    carregarLogs();

    iniciarReconhecimento();

  }

);


// =========================
// 📷 INICIAR CAMERA
// =========================
async function iniciarCamera(){

  try{

    const stream =
      await navigator
      .mediaDevices
      .getUserMedia({

        video:{

          facingMode:"user"

        },

        audio:false

      });

    video.srcObject =
      stream;

    await video.play();

  }catch(e){

    console.log(e);

    atualizarStatus(
      "❌ Erro ao acessar câmera"
    );

  }

}


// =========================
// 🧠 RECONHECIMENTO FAKE
// =========================
function iniciarReconhecimento(){

  setInterval(()=>{

    const nomes = [

      "Lucas Andrade",
      "Maria Eduarda",
      "Pedro Henrique",
      "Ana Clara",
      "Gabriel Souza"

    ];

    const aleatorio =
      nomes[
        Math.floor(
          Math.random()
          *
          nomes.length
        )
      ];

    const hora =
      new Date()
      .toLocaleTimeString(
        "pt-BR"
      );

    atualizarAluno(

      aleatorio,

      `Entrada registrada às ${hora}`

    );

    atualizarStatus(
      "✅ Rosto reconhecido"
    );

  },7000);

}


// =========================
// 👤 ALUNO
// =========================
function atualizarAluno(

  nome,
  info

){

  document
    .getElementById(
      "studentName"
    )
    .innerText =
    nome;

  document
    .getElementById(
      "studentInfo"
    )
    .innerText =
    info;

}


// =========================
// 📡 STATUS
// =========================
function atualizarStatus(texto){

  document
    .getElementById(
      "recognitionStatus"
    )
    .innerText =
    texto;

}


// =========================
// 📋 LOGS
// =========================
function carregarLogs(){

  const lista =
    document.getElementById(
      "logsList"
    );

  lista.innerHTML = "";


  const registros = [

    {

      nome:
        "Lucas Andrade",

      hora:
        "07:12",

      tipo:
        "Entrada"

    },

    {

      nome:
        "Ana Clara",

      hora:
        "07:18",

      tipo:
        "Entrada"

    },

    {

      nome:
        "Pedro Henrique",

      hora:
        "07:25",

      tipo:
        "Saída"

    },

    {

      nome:
        "Maria Eduarda",

      hora:
        "07:33",

      tipo:
        "Entrada"

    }

  ];


  registros.forEach(

    registro=>{

      const div =
        document
        .createElement("div");

      div.className =
        "log-item";

      div.innerHTML = `

        <div class="log-left">

          <div class="log-avatar">
            👤
          </div>

          <div>

            <h4>
              ${registro.nome}
            </h4>

            <p>
              ${registro.tipo}
            </p>

          </div>

        </div>


        <strong>
          ${registro.hora}
        </strong>

      `;

      lista.appendChild(div);

    }

  );

}


// =========================
// 🚪 LOGOUT
// =========================
function logout(){

  window.location.href =
    "./index.html";

}