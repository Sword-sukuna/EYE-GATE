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
