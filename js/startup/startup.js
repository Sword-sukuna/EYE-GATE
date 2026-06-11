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