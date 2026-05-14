// =========================
// 🌐 EYE GATE LOGIN
// =========================

// senha master
const SENHA_ADMIN =
"Silvano@rosa10";


// =========================
// 🔐 LOGIN ADMIN
// =========================
function loginAdmin(){

  const senha =
    document
    .getElementById(
      "senha"
    )
    .value
    .trim();

  const erro =
    document
    .getElementById(
      "erroLogin"
    );

  if(
    senha
    ===
    SENHA_ADMIN
  ){

    localStorage.setItem(
      "modo",
      "admin"
    );

    location.href =
      "./index.html";

  }else{

    erro.innerText =
      "❌ Senha incorreta";

  }

}



// =========================
// 👀 MODO MONITOR
// =========================
function entrarMonitor(){

  localStorage.setItem(
    "modo",
    "monitor"
  );

  location.href =
    "./index.html";

}



// =========================
// ⌨ ENTER LOGIN
// =========================
document
.addEventListener(

  "keydown",

  e=>{

    if(
      e.key
      ===
      "Enter"
    ){

      loginAdmin();

    }

  }

);



// =========================
// ✨ ANIMAÇÃO BG
// =========================
function criarParticulas(){

  const box =
    document.querySelector(
      ".particles"
    );

  if(!box) return;

  for(
    let i=0;
    i<40;
    i++
  ){

    const p =
      document
      .createElement(
        "span"
      );

    p.className =
      "particle";

    p.style.left =
      Math.random()*100
      + "%";

    p.style.top =
      Math.random()*100
      + "%";

    p.style.animationDelay =
      Math.random()*5
      + "s";

    p.style.animationDuration =
      (
        Math.random()*5
        + 4
      ) + "s";

    box.appendChild(p);

  }

}


// iniciar
criarParticulas();

// =========================
// 🌐 EYE GATE DATABASE
// =========================

// 🔥 IMPORTANTE:
// troque pelos seus dados do JSONBIN


const BIN_ID =
"SEU_BIN_ID";


const API_KEY =
"SUA_API_KEY";


const BASE_URL =
`https://api.jsonbin.io/v3/b/${BIN_ID}`;



// =========================
// 📥 PEGAR BANCO
// =========================
async function pegarBanco(){

  const res =
    await fetch(

      BASE_URL,

      {

        headers:{

          "X-Master-Key":
          API_KEY

        }

      }

    );

  const data =
    await res.json();

  return data.record;

}



// =========================
// 💾 SALVAR BANCO
// =========================
async function salvarBanco(
  data
){

  await fetch(

    BASE_URL,

    {

      method:"PUT",

      headers:{

        "Content-Type":
        "application/json",

        "X-Master-Key":
        API_KEY

      },

      body:
      JSON.stringify(data)

    }

  );

}



// =========================
// 🚀 INICIAR BANCO
// =========================
async function iniciarBanco(){

  let banco =
    await pegarBanco();

  if(!banco.usuarios){

    banco = {

      // 👤 usuários
      usuarios:[],

      // 👥 alunos
      pessoas:[],

      // 🕒 registros
      registros:[],

      // ⚙ configs
      configs:{

        nomeSistema:
        "EYE GATE",

        escola:
        "Minha Escola"

      }

    };

    await salvarBanco(
      banco
    );

  }

}



// =========================
// 👤 USUÁRIOS
// =========================
async function salvarUsuario(
  usuario
){

  const banco =
    await pegarBanco();

  usuario.id =
    Date.now();

  banco.usuarios.push(
    usuario
  );

  await salvarBanco(
    banco
  );

}



async function listarUsuarios(
  callback
){

  const banco =
    await pegarBanco();

  callback(
    banco.usuarios || []
  );

}



// =========================
// 👥 PESSOAS
// =========================
async function salvarPessoa(
  pessoa
){

  const banco =
    await pegarBanco();

  pessoa.id =
    Date.now();

  banco.pessoas.push(
    pessoa
  );

  await salvarBanco(
    banco
  );

}



async function listarPessoas(
  callback
){

  const banco =
    await pegarBanco();

  callback(
    banco.pessoas || []
  );

}



async function deletarPessoa(
  id
){

  const banco =
    await pegarBanco();

  banco.pessoas =
    banco.pessoas.filter(

      p=>
      p.id !== id

    );

  await salvarBanco(
    banco
  );

}



// =========================
// 🕒 REGISTROS
// =========================
async function salvarRegistro(
  registro
){

  const banco =
    await pegarBanco();

  registro.id =
    Date.now();

  banco.registros.unshift(
    registro
  );

  await salvarBanco(
    banco
  );

}



async function listarRegistros(
  callback
){

  const banco =
    await pegarBanco();

  callback(
    banco.registros || []
  );

}



async function listarRegistrosPessoa(

  pessoaId,
  callback

){

  const banco =
    await pegarBanco();

  const registros =
    banco.registros.filter(

      r=>
      r.pessoaId
      ===
      pessoaId

    );

  callback(registros);

}



// =========================
// 🗑 RESETAR
// =========================
async function resetarPessoas(){

  const confirmar =
    confirm(

      "Apagar todas as pessoas?"

    );

  if(!confirmar) return;

  const banco =
    await pegarBanco();

  banco.pessoas = [];

  await salvarBanco(
    banco
  );

  location.reload();

}



async function resetarRegistros(){

  const confirmar =
    confirm(

      "Apagar todos os registros?"

    );

  if(!confirmar) return;

  const banco =
    await pegarBanco();

  banco.registros = [];

  await salvarBanco(
    banco
  );

  location.reload();

}

// =========================
// 👁 EYE GATE
// 🧠 RECONHECIMENTO FACIAL
// =========================


// =========================
// 🔐 MODO
// =========================
const modoSistema =
  localStorage.getItem(
    "modo"
  );


// sem login
if(!modoSistema){

  location.href =
    "./login.html";

}



// =========================
// 🧠 VARIÁVEIS
// =========================
let processando = false;

let rostoAtual = null;

let framesReconhecidos = 0;

const framesNecessarios = 3;

const delayRegistro = 10000;

let ultimoRegistro = {};



// =========================
// 🚀 INICIAR
// =========================
window.addEventListener(

  "DOMContentLoaded",

  async ()=>{

    // banco
    await iniciarBanco();


    // modo
    configurarModo();


    // camera
    await iniciarCamera();


    // IA
    await carregarModelos();


    // listas
    await carregarPessoas();

    await carregarRegistros();

    await carregarMonitor();


    // botão cadastro
    const btn =
      document.getElementById(
        "btnCadastrar"
      );

    if(btn){

      btn.addEventListener(

        "click",

        cadastrarPessoa

      );

    }


    // reconhecimento
    iniciarReconhecimento();


    // relógio
    atualizarRelogio();

  }

);




// =========================
// 📷 CAMERA
// =========================
async function iniciarCamera(){

  try{

    const stream =
      await navigator
      .mediaDevices
      .getUserMedia({

        video:{

          facingMode:"user",

          width:{
            ideal:1280
          },

          height:{
            ideal:720
          }

        },

        audio:false

      });

    const video =
      document.getElementById(
        "video"
      );

    video.srcObject =
      stream;

    await video.play();

    atualizarStatus(
      "📷 Camera iniciada"
    );

  }catch(e){

    console.error(e);

    atualizarStatus(
      "❌ Erro na câmera"
    );

  }

}




// =========================
// 🧠 IA
// =========================
async function carregarModelos(){

  atualizarStatus(
    "📦 Carregando IA..."
  );

  await faceapi
  .nets
  .tinyFaceDetector
  .loadFromUri("./models");

  await faceapi
  .nets
  .faceLandmark68Net
  .loadFromUri("./models");

  await faceapi
  .nets
  .faceRecognitionNet
  .loadFromUri("./models");

  atualizarStatus(
    "✅ IA carregada"
  );

}




// =========================
// 👤 CADASTRAR
// =========================
async function cadastrarPessoa(){

  const nome =
    document
    .getElementById(
      "nome"
    )
    .value
    .trim();

  if(!nome){

    alert(
      "Digite um nome"
    );

    return;

  }

  atualizarStatus(
    "📸 Capturando rosto..."
  );


  const descritores = [];


  for(
    let i=0;
    i<5;
    i++
  ){

    atualizarStatus(

      `📸 Captura ${
        i+1
      } de 5`

    );

    await esperar(1200);

    const deteccao =
      await faceapi
      .detectSingleFace(

        video,

        new faceapi
        .TinyFaceDetectorOptions({

          inputSize:416,

          scoreThreshold:0.3

        })

      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if(deteccao){

      descritores.push(

        deteccao.descriptor

      );

    }

  }


  if(
    descritores.length < 3
  ){

    atualizarStatus(
      "❌ Falha facial"
    );

    return;

  }


  const media =
    calcularMediaFace(
      descritores
    );


  await salvarPessoa({

    nome,

    face:
    Array.from(media)

  });


  document
  .getElementById(
    "nome"
  )
  .value = "";


  atualizarStatus(
    `✅ ${nome} cadastrado`
  );

  carregarPessoas();

}




// =========================
// 🔎 RECONHECIMENTO
// =========================
async function iniciarReconhecimento(){

  const video =
    document.getElementById(
      "video"
    );

  setInterval(

    async ()=>{

      if(processando) return;

      processando = true;

      const deteccao =
        await faceapi
        .detectSingleFace(

          video,

          new faceapi
          .TinyFaceDetectorOptions({

            inputSize:160,

            scoreThreshold:0.5

          })

        )
        .withFaceLandmarks()
        .withFaceDescriptor();


      if(!deteccao){

        processando = false;

        return;

      }


      const faceAtual =
        deteccao.descriptor;


      listarPessoas(

        pessoas=>{

          let reconhecido =
            false;


          pessoas.forEach(

            pessoa=>{

              const dist =
                faceapi
                .euclideanDistance(

                  faceAtual,

                  pessoa.face

                );


              if(dist < 0.50){

                reconhecido = true;


                if(

                  rostoAtual
                  ===
                  pessoa.id

                ){

                  framesReconhecidos++;

                }else{

                  rostoAtual =
                    pessoa.id;

                  framesReconhecidos = 1;

                }


                if(

                  framesReconhecidos
                  >=
                  framesNecessarios

                ){

                  registrarPonto(
                    pessoa
                  );

                  framesReconhecidos = 0;

                }

              }

            }

          );


          if(!reconhecido){

            rostoAtual = null;

            framesReconhecidos = 0;

            atualizarStatus(
              "🔎 Rosto desconhecido"
            );

          }

          processando = false;

        }

      );

    },

    800

  );

}

// =========================
// 🕒 REGISTROS
// =========================
function registrarPonto(
  pessoa
){

  const agora =
    Date.now();


  // anti spam
  if(

    ultimoRegistro[
      pessoa.id
    ]

    &&

    agora -
    ultimoRegistro[
      pessoa.id
    ]
    <
    delayRegistro

  ){

    return;

  }


  ultimoRegistro[
    pessoa.id
  ] = agora;


  // data
  const dataObj =
    new Date();

  const horario =
    dataObj.toLocaleTimeString(
      "pt-BR"
    );

  const data =
    dataObj.toLocaleDateString(
      "pt-BR"
    );


  // entrada / saída
  listarRegistrosPessoa(

    pessoa.id,

    async registros=>{

      let tipo =
        "Entrada";


      const ultimo =
        registros[
          registros.length - 1
        ];


      if(ultimo){

        tipo =
          ultimo.tipo
          ===
          "Entrada"
          ?
          "Saída"
          :
          "Entrada";

      }


      // salvar
      await salvarRegistro({

        pessoaId:
        pessoa.id,

        nome:
        pessoa.nome,

        horario,

        data,

        tipo

      });


      // atualizar UI
      carregarRegistros();

      carregarMonitor();


      // efeitos
      tocarSom();

      falar(

        `${pessoa.nome}
        registrou
        ${tipo}`

      );


      document
      .body
      .classList
      .add(
        "face-detected"
      );


      setTimeout(()=>{

        document
        .body
        .classList
        .remove(
          "face-detected"
        );

      },1500);


      atualizarStatus(

        `✅ ${pessoa.nome}
        registrou ${tipo}`

      );

    }

  );

}




// =========================
// 👥 LISTA PESSOAS
// =========================
async function carregarPessoas(){

  await listarPessoas(

    pessoas=>{

      const lista =
        document.getElementById(
          "lista"
        );

      if(!lista) return;

      lista.innerHTML = "";


      pessoas.forEach(

        pessoa=>{

          const div =
            document
            .createElement(
              "div"
            );

          div.className =
            "item";


          div.innerHTML = `

            <div class="item-info">

              <strong>
                👤 ${pessoa.nome}
              </strong>

              <small>
                ID: ${pessoa.id}
              </small>

            </div>


            <div class="item-actions">

              <button

                class="
                small-btn
                view-btn
                "

                onclick="
                abrirHistorico(
                  ${pessoa.id},
                  '${pessoa.nome}'
                )
                "

              >

                Histórico

              </button>


              <button

                class="
                small-btn
                delete-btn
                "

                onclick="
                deletarPessoa(
                  ${pessoa.id}
                )
                "

              >

                Excluir

              </button>

            </div>

          `;

          lista.appendChild(
            div
          );

        }

      );

    }

  );

}




// =========================
// 📋 REGISTROS
// =========================
async function carregarRegistros(){

  await listarRegistros(

    registros=>{

      const lista =
        document.getElementById(
          "registros"
        );

      if(!lista) return;

      lista.innerHTML = "";


      registros.forEach(

        registro=>{

          const div =
            document
            .createElement(
              "div"
            );

          div.className =
            "item";


          div.innerHTML = `

            <div class="item-info">

              <strong>
                👤 ${registro.nome}
              </strong>

              <small>
                📅 ${registro.data}
              </small>

            </div>


            <div>

              <strong>
                ${registro.horario}
              </strong>

              <p>
                ${registro.tipo}
              </p>

            </div>

          `;

          lista.appendChild(
            div
          );

        }

      );

    }

  );

}




// =========================
// 👀 MONITOR
// =========================
function carregarMonitor(){

  listarRegistros(

    registros=>{

      const box =
        document.getElementById(
          "monitorRegistros"
        );

      if(!box) return;

      box.innerHTML = "";


      registros
      .slice(0,15)
      .forEach(

        registro=>{

          const div =
            document
            .createElement(
              "div"
            );

          div.className =
            "item live-registro";


          div.innerHTML = `

            <div class="item-info">

              <strong>
                👤 ${registro.nome}
              </strong>

              <small>
                📅 ${registro.data}
              </small>

            </div>


            <div>

              <strong>
                ${registro.horario}
              </strong>

              <p>
                ${registro.tipo}
              </p>

            </div>

          `;

          box.appendChild(
            div
          );

        }

      );

    }

  );

}




// =========================
// 📋 MODAL
// =========================
function abrirHistorico(

  pessoaId,
  nome

){

  document
  .getElementById(
    "modal"
  )
  .classList
  .add("show");


  document
  .getElementById(
    "modalNome"
  )
  .innerText =
  `📋 ${nome}`;


  listarRegistrosPessoa(

    pessoaId,

    registros=>{

      const box =
        document
        .getElementById(
          "modalRegistros"
        );

      box.innerHTML = "";


      if(
        registros.length === 0
      ){

        box.innerHTML =
        `
          <p>
            Nenhum registro
          </p>
        `;

        return;

      }


      registros.forEach(

        registro=>{

          const div =
            document
            .createElement(
              "div"
            );

          div.className =
            "registro-item";


          div.innerHTML = `

            <div>

              <strong>
                📅 ${registro.data}
              </strong>

              <p>
                ${registro.horario}
              </p>

            </div>

            <div>

              <strong>
                ${registro.tipo}
              </strong>

            </div>

          `;

          box.appendChild(
            div
          );

        }

      );

    }

  );

}




// =========================
// ❌ FECHAR MODAL
// =========================
function fecharModal(){

  document
  .getElementById(
    "modal"
  )
  .classList
  .remove("show");

}




// =========================
// 📡 STATUS
// =========================
function atualizarStatus(
  texto
){

  const box =
    document.getElementById(
      "status"
    );

  if(box){

    box.innerText =
      texto;

  }


  atualizarMonitorStatus(
    texto
  );

}




// =========================
// 👀 STATUS MONITOR
// =========================
function atualizarMonitorStatus(
  texto
){

  const box =
    document.getElementById(
      "monitorStatus"
    );

  if(!box) return;

  box.innerText =
    texto;

}

// =========================
// ⏰ RELÓGIO
// =========================
function atualizarRelogio(){

  const agora =
    new Date();

  const hora =
    agora.toLocaleTimeString(
      "pt-BR"
    );

  const data =
    agora.toLocaleDateString(
      "pt-BR"
    );


  const h =
    document.getElementById(
      "clockHora"
    );

  const d =
    document.getElementById(
      "clockData"
    );


  if(h){

    h.innerText =
      hora;

  }

  if(d){

    d.innerText =
      data;

  }

}



// atualizar relógio
setInterval(

  atualizarRelogio,

  1000

);



// =========================
// 🔀 MODOS
// =========================
function configurarModo(){

  if(

    modoSistema
    ===
    "monitor"

  ){

    trocarModo(
      "monitor"
    );


    // esconder admin
    const admin =
      document.getElementById(
        "adminArea"
      );

    if(admin){

      admin.remove();

    }


    // esconder tabs
    const tabs =
      document.querySelector(
        ".tabs"
      );

    if(tabs){

      tabs.style.display =
        "none";

    }

  }else{

    trocarModo(
      "admin"
    );

  }

}




// =========================
// 🔄 TROCAR MODO
// =========================
function trocarModo(
  modo
){

  // tabs
  document
  .querySelectorAll(
    ".tab"
  )
  .forEach(

    t=>t.classList.remove(
      "active"
    )

  );


  // ativar
  if(modo === "admin"){

    document
    .querySelectorAll(
      ".tab"
    )[0]
    .classList
    .add("active");

  }else{

    document
    .querySelectorAll(
      ".tab"
    )[1]
    .classList
    .add("active");

  }


  // admin
  document
  .getElementById(
    "adminArea"
  )
  .style.display =

  modo === "admin"
  ?
  "block"
  :
  "none";


  // monitor
  document
  .getElementById(
    "monitorArea"
  )
  .style.display =

  modo === "monitor"
  ?
  "block"
  :
  "none";

}




// =========================
// 🔊 SOM
// =========================
function tocarSom(){

  const audio =
    new Audio(

      "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"

    );

  audio.volume = 0.5;

  audio.play().catch(()=>{});

}




// =========================
// 🗣 VOZ
// =========================
function falar(
  texto
){

  if(
    !(
      "speechSynthesis"
      in
      window
    )
  ) return;


  const voz =
    new SpeechSynthesisUtterance(
      texto
    );

  voz.lang =
    "pt-BR";

  voz.rate = 1;

  voz.pitch = 1;


  speechSynthesis.cancel();

  speechSynthesis.speak(
    voz
  );

}




// =========================
// 🧮 MÉDIA FACIAL
// =========================
function calcularMediaFace(
  descritores
){

  const media =
    new Float32Array(
      128
    );


  for(
    let i=0;
    i<128;
    i++
  ){

    let soma = 0;


    descritores.forEach(

      d=>{

        soma += d[i];

      }

    );


    media[i] =

      soma /

      descritores.length;

  }


  return media;

}




// =========================
// ⏳ ESPERAR
// =========================
function esperar(ms){

  return new Promise(

    r=>setTimeout(
      r,
      ms
    )

  );

}




// =========================
// 🔄 AUTO UPDATE
// =========================
setInterval(()=>{

  carregarMonitor();

},5000);




// =========================
// 💓 KEEP ALIVE
// =========================
setInterval(

  async ()=>{

    try{

      const banco =
        await pegarBanco();

      await salvarBanco(
        banco
      );

      console.log(
        "✅ Banco ativo"
      );

    }catch(e){

      console.log(
        "❌ Erro keep alive"
      );

    }

  },

  1000 * 60 * 30

);




// =========================
// 🚪 LOGOUT
// =========================
function logout(){

  localStorage.removeItem(
    "modo"
  );

  location.href =
    "./login.html";

}

// =========================
// 🌐 BANCO JSONBIN
// =========================
const BIN_ID =
"SEU_BIN_ID";


const API_KEY =
"SUA_API_KEY";


const BASE_URL =
`https://api.jsonbin.io/v3/b/${BIN_ID}`;




// =========================
// 📥 PEGAR BANCO
// =========================
async function pegarBanco(){

  const res =
    await fetch(

      BASE_URL,

      {

        headers:{

          "X-Master-Key":
          API_KEY

        }

      }

    );


  const data =
    await res.json();


  return data.record;

}




// =========================
// 💾 SALVAR BANCO
// =========================
async function salvarBanco(
  data
){

  await fetch(

    BASE_URL,

    {

      method:"PUT",

      headers:{

        "Content-Type":
        "application/json",

        "X-Master-Key":
        API_KEY

      },

      body:
      JSON.stringify(data)

    }

  );

}




// =========================
// 🚀 INICIAR BANCO
// =========================
async function iniciarBanco(){

  let banco =
    await pegarBanco();


  // criar estrutura
  if(!banco.pessoas){

    banco = {

      pessoas:[],

      registros:[],

      configuracoes:{

        escola:
        "EYE GATE"

      }

    };


    await salvarBanco(
      banco
    );

  }

}




// =========================
// 👥 LISTAR PESSOAS
// =========================
async function listarPessoas(
  callback
){

  const banco =
    await pegarBanco();


  callback(

    banco.pessoas || []

  );

}




// =========================
// ➕ SALVAR PESSOA
// =========================
async function salvarPessoa(
  pessoa
){

  const banco =
    await pegarBanco();


  pessoa.id =
    Date.now();


  banco.pessoas.push(
    pessoa
  );


  await salvarBanco(
    banco
  );

}




// =========================
// ❌ DELETAR PESSOA
// =========================
async function deletarPessoa(
  id
){

  const banco =
    await pegarBanco();


  banco.pessoas =
    banco.pessoas.filter(

      p=>
      p.id !== id

    );


  await salvarBanco(
    banco
  );


  carregarPessoas();

}




// =========================
// 🔄 RESETAR PESSOAS
// =========================
async function resetarPessoas(){

  const confirmar =
    confirm(

      "Deseja apagar TODAS as pessoas?"

    );

  if(!confirmar) return;


  const banco =
    await pegarBanco();


  banco.pessoas = [];


  await salvarBanco(
    banco
  );


  carregarPessoas();

}




// =========================
// 🕒 SALVAR REGISTRO
// =========================
async function salvarRegistro(
  registro
){

  const banco =
    await pegarBanco();


  registro.id =
    Date.now();


  banco.registros.unshift(
    registro
  );


  await salvarBanco(
    banco
  );

}




// =========================
// 📋 LISTAR REGISTROS
// =========================
async function listarRegistros(
  callback
){

  const banco =
    await pegarBanco();


  callback(

    banco.registros || []

  );

}




// =========================
// 👤 REGISTROS PESSOA
// =========================
async function listarRegistrosPessoa(

  pessoaId,
  callback

){

  const banco =
    await pegarBanco();


  const registros =
    banco.registros.filter(

      r=>
      r.pessoaId === pessoaId

    );


  callback(
    registros
  );

}




// =========================
// ❌ DELETAR REGISTRO
// =========================
async function deletarRegistro(
  id
){

  const banco =
    await pegarBanco();


  banco.registros =
    banco.registros.filter(

      r=>
      r.id !== id

    );


  await salvarBanco(
    banco
  );

}




// =========================
// 🔄 RESETAR REGISTROS
// =========================
async function resetarRegistros(){

  const confirmar =
    confirm(

      "Deseja apagar TODOS os registros?"

    );

  if(!confirmar) return;


  const banco =
    await pegarBanco();


  banco.registros = [];


  await salvarBanco(
    banco
  );


  carregarRegistros();

  carregarMonitor();

}

// =========================
// 🔐 LOGIN ADMIN
// =========================
function loginAdmin(){

  const senha =
    document
    .getElementById(
      "senha"
    )
    .value;


  const erro =
    document
    .getElementById(
      "erroLogin"
    );


  // senha padrão
  if(
    senha === "admin123"
  ){

    localStorage.setItem(
      "modo",
      "admin"
    );


    location.href =
      "./index.html";

  }else{

    erro.innerText =
      "❌ Senha inválida";

  }

}




// =========================
// 👀 ENTRAR MONITOR
// =========================
function entrarMonitor(){

  localStorage.setItem(
    "modo",
    "monitor"
  );


  location.href =
    "./index.html";

}




// =========================
// ⌨ ENTER LOGIN
// =========================
document
.addEventListener(

  "keydown",

  e=>{

    if(
      e.key === "Enter"
    ){

      loginAdmin();

    }

  }

);




// =========================
// 🌌 PARTICULAS BG
// =========================
function criarParticulas(){

  const box =
    document.querySelector(
      ".particles"
    );


  if(!box) return;


  for(
    let i=0;
    i<40;
    i++
  ){

    const p =
      document
      .createElement(
        "span"
      );


    p.classList.add(
      "particle"
    );


    p.style.left =
      Math.random()*100
      + "%";


    p.style.animationDelay =
      Math.random()*10
      + "s";


    p.style.animationDuration =
      (
        Math.random()*10
        + 10
      ) + "s";


    box.appendChild(p);

  }

}




// iniciar
criarParticulas();




// =========================
// 👁 EFEITO LOGO
// =========================
const logo =
  document.querySelector(
    ".logo-circle"
  );


if(logo){

  setInterval(()=>{

    logo.classList.add(
      "pulse"
    );

    setTimeout(()=>{

      logo.classList.remove(
        "pulse"
      );

    },1000);

  },3000);

}
