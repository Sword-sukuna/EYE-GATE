// =========================
// 👁 FACE API
// =========================
window.debugLogs = [];

let streamCadastro = null;

let streamMonitor = null;

let faceMatcher = null;

let alunosCache = [];

let matcherPronto = false;

let reconhecendo = false;

let descriptorsTemp = [];

let capturaAuto = null;

let graficoLogs = null;

let faceApiPronta = false;

const contadorFrames = {};

const ultimoReconhecimento = {};

const TEMPO_BLOQUEIO = 5 * 60 * 1000;

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

setInterval(async ()=>{

  await carregarStats();

  await carregarLogs();

  await carregarGraficoLogs();

},5000);

async function iniciarTelaInicial(){

  const barra =
    document.getElementById(
      "startupProgress"
    );

  const texto =
    document.getElementById(
      "startupText"
    );

  const etapas = [

    {
      progresso:25,
      texto:"Inicializando IA..."
    },

    {
      progresso:50,
      texto:"Carregando reconhecimento facial..."
    },

    {
      progresso:75,
      texto:"Conectando banco de dados..."
    },

    {
      progresso:100,
      texto:"Sistema pronto"
    }

  ];

  for(const etapa of etapas){

    barra.style.width =
      etapa.progresso + "%";

    texto.innerText =
      etapa.texto;

    await new Promise(r =>
      setTimeout(r, 900)
    );

  }

  const tela =
    document.getElementById(
      "startupScreen"
    );

  tela.style.transition =
    "opacity .8s ease";

  tela.style.opacity = "0";

  setTimeout(()=>{

    tela.remove();

  },800);

}

window.addEventListener(
  "load",
  iniciarTelaInicial
);

// =========================
// 🚀 STARTUP SCREEN
// =========================
window.addEventListener("load", ()=>{

  const progress =
    document.getElementById(
      "startupProgress"
    );

  const text =
    document.getElementById(
      "startupText"
    );

  const screen =
    document.getElementById(
      "startupScreen"
    );

  const mensagens = [

    "Inicializando sistema...",
    "Carregando IA facial...",
    "Sincronizando banco...",
    "Preparando reconhecimento...",
    "Sistema pronto"

  ];

  let valor = 0;
  let etapa = 0;

  const intervalo = setInterval(()=>{

    valor += 20;

    progress.style.width =
      `${valor}%`;

    if(mensagens[etapa]){

      text.innerText =
        mensagens[etapa];

      etapa++;
    }

    if(valor >= 100){

      clearInterval(intervalo);

      setTimeout(()=>{

        screen.style.opacity = "0";

        setTimeout(()=>{

          screen.style.display = "none";

        },1000);

      },700);

    }

  },700);

});