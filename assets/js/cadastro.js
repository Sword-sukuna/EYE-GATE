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
// 📷 VIDEO
// =========================
const video =
  document.getElementById(
    "video"
  );


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
// 👤 CAPTURAR ALUNO
// =========================
function capturarAluno(){

  const nome =
    document
    .getElementById(
      "nome"
    )
    .value;

  const matricula =
    document
    .getElementById(
      "matricula"
    )
    .value;

  const turma =
    document
    .getElementById(
      "turma"
    )
    .value;


  if(

    !nome ||
    !matricula ||
    !turma

  ){

    atualizarStatus(
      "⚠ Preencha todos os campos"
    );

    return;

  }


  atualizarStatus(
    "📸 Captura realizada com sucesso"
  );


  // MOCK TEMPORÁRIO
  // depois ligaremos com IA real

  const aluno = {

    id:
      Date.now(),

    nome,

    matricula,

    turma

  };


  salvarAluno(
    aluno
  );


  limparCampos();

  carregarAlunos();

}


// =========================
// 💾 SALVAR
// =========================
function salvarAluno(
  aluno
){

  let alunos =
    JSON.parse(

      localStorage.getItem(
        "eyeGateStudents"
      )

    ) || [];


  alunos.push(
    aluno
  );


  localStorage.setItem(

    "eyeGateStudents",

    JSON.stringify(
      alunos
    )

  );

}


// =========================
// 👥 CARREGAR
// =========================
function carregarAlunos(){

  const grid =
    document.getElementById(
      "studentsGrid"
    );

  const alunos =
    JSON.parse(

      localStorage.getItem(
        "eyeGateStudents"
      )

    ) || [];


  grid.innerHTML = "";


  if(alunos.length === 0){

    grid.innerHTML = `

      <p>
        Nenhum aluno cadastrado
      </p>

    `;

    return;

  }


  alunos.forEach(

    aluno=>{

      const card =
        document.createElement(
          "div"
        );

      card.className =
        "student-card";

      card.innerHTML = `

        <div class="student-avatar">
          👤
        </div>

        <h4>
          ${aluno.nome}
        </h4>

        <p>
          🎓 ${aluno.matricula}
        </p>

        <p>
          🏫 ${aluno.turma}
        </p>

      `;

      grid.appendChild(
        card
      );

    }

  );

}


// =========================
// 🧹 LIMPAR
// =========================
function limparCampos(){

  document
    .getElementById(
      "nome"
    )
    .value = "";

  document
    .getElementById(
      "matricula"
    )
    .value = "";

  document
    .getElementById(
      "turma"
    )
    .value = "";

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

    carregarAlunos();

  }

);