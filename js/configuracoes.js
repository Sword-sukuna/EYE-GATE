// =========================
// 👁 EYE GATE CONFIG
// =========================


// =========================
// 🚀 INICIAR
// =========================
window.addEventListener(

  "DOMContentLoaded",

  ()=>{

    iniciarConfiguracoes();

  }

);


// =========================
// ⚙ CONFIG
// =========================
function iniciarConfiguracoes(){

  iniciarBotoes();

  iniciarSwitches();

}


// =========================
// 🔘 BOTÕES
// =========================
function iniciarBotoes(){

  const botoes =
    document.querySelectorAll(
      ".config-btn"
    );


  // limpar registros
  botoes[0].addEventListener(

    "click",

    limparRegistros

  );


  // reset alunos
  botoes[1].addEventListener(

    "click",

    resetarAlunos

  );


  // reset sistema
  botoes[2].addEventListener(

    "click",

    resetarSistema

  );

}


// =========================
// 🎛 SWITCHES
// =========================
function iniciarSwitches(){

  const switches =
    document.querySelectorAll(
      ".switch input"
    );

  switches.forEach((item)=>{

    item.addEventListener(

      "change",

      ()=>{

        salvarConfiguracoes();

      }

    );

  });

}


// =========================
// 💾 CONFIG
// =========================
function salvarConfiguracoes(){

  const switches =
    document.querySelectorAll(
      ".switch input"
    );

  const configuracoes = {

    tema:
      switches[0].checked,

    efeitos:
      switches[1].checked,

    reconhecimento:
      switches[2].checked,

    logs:
      switches[3].checked

  };


  localStorage.setItem(

    "configEyeGate",

    JSON.stringify(
      configuracoes
    )

  );


  mostrarMensagem(
    "Configuração salva"
  );

}


// =========================
// 🗑 LIMPAR LOGS
// =========================
function limparRegistros(){

  const confirmar =
    confirm(
      "Deseja limpar os registros?"
    );

  if(!confirmar) return;


  localStorage.removeItem(
    "logsEyeGate"
  );

  mostrarMensagem(
    "Registros removidos"
  );

}


// =========================
// 👥 RESET ALUNOS
// =========================
function resetarAlunos(){

  const confirmar =
    confirm(
      "Deseja apagar os alunos?"
    );

  if(!confirmar) return;


  localStorage.removeItem(
    "alunosEyeGate"
  );

  mostrarMensagem(
    "Alunos removidos"
  );

}


// =========================
// ⚠ RESET TOTAL
// =========================
function resetarSistema(){

  const confirmar =
    confirm(
      "RESETAR TODO SISTEMA?"
    );

  if(!confirmar) return;


  localStorage.clear();

  mostrarMensagem(
    "Sistema resetado"
  );


  setTimeout(()=>{

    window.location.href =
      "./index.html";

  },1500);

}


// =========================
// 💬 MSG
// =========================
function mostrarMensagem(texto){

  alert(texto);

}