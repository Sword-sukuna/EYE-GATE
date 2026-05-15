// =========================
// 🔐 LOGIN
// =========================
const usuario =
  localStorage.getItem(
    "eyeGateUser"
  );

if(!usuario){

  location.href =
    "./index.html";

}


// =========================
// 📷 CÂMERA
// =========================
const video =
  document.getElementById(
    "video"
  );

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

    atualizarStatus(
      "✅ Câmera conectada"
    );

  }catch(e){

    atualizarStatus(
      "❌ Erro ao acessar câmera"
    );

    console.error(e);

  }

}


// =========================
// 📡 STATUS
// =========================
function atualizarStatus(
  texto
){

  const status =
    document.getElementById(
      "status"
    );

  status.innerText =
    texto;

}


// =========================
// 📊 DASHBOARD
// =========================
function carregarDashboard(){

  // MOCK TEMPORÁRIO
  // depois ligaremos no banco real

  document.getElementById(
    "totalStudents"
  ).innerText = 328;

  document.getElementById(
    "presentStudents"
  ).innerText = 241;

  document.getElementById(
    "entriesToday"
  ).innerText = 517;

  document.getElementById(
    "alerts"
  ).innerText = 2;

}


// =========================
// 🕒 REGISTROS FAKE
// =========================
function carregarRegistros(){

  const liveList =
    document.getElementById(
      "liveList"
    );

  const registros = [

    {
      nome:"Lucas Almeida",
      horario:"07:15",
      tipo:"Entrada"
    },

    {
      nome:"Maria Eduarda",
      horario:"07:18",
      tipo:"Entrada"
    },

    {
      nome:"João Pedro",
      horario:"07:22",
      tipo:"Saída"
    },

    {
      nome:"Ana Clara",
      horario:"07:31",
      tipo:"Entrada"
    }

  ];


  liveList.innerHTML = "";


  registros.forEach(

    registro=>{

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "live-item";

      item.innerHTML = `

        <div>

          <strong>
            👤 ${registro.nome}
          </strong>

          <p>
            ${registro.tipo}
          </p>

        </div>


        <strong>
          ${registro.horario}
        </strong>

      `;

      liveList.appendChild(
        item
      );

    }

  );

}


// =========================
// 🚪 LOGOUT
// =========================
function logout(){

  localStorage.removeItem(
    "eyeGateUser"
  );

  location.href =
    "./index.html";

}


// =========================
// 🚀 INIT
// =========================
window.addEventListener(

  "DOMContentLoaded",

  ()=>{

    iniciarCamera();

    carregarDashboard();

    carregarRegistros();

  }

);