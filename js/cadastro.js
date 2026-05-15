// =========================
// 👁 EYE GATE CADASTRO
// =========================


// =========================
// 🚀 INICIAR
// =========================
window.addEventListener(

  "DOMContentLoaded",

  ()=>{

    iniciarCamera();

    carregarAlunos();

    iniciarCadastro();

  }

);


// =========================
// 📷 CAMERA
// =========================
async function iniciarCamera(){

  const video =
    document.getElementById(
      "video"
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
// 👤 CADASTRO
// =========================
function iniciarCadastro(){

  const botao =
    document.querySelector(
      ".cadastro-btn"
    );

  botao.addEventListener(

    "click",

    cadastrarAluno

  );

}


// =========================
// 💾 SALVAR
// =========================
function cadastrarAluno(){

  const nome =
    document
    .getElementById(
      "nome"
    )
    .value
    .trim();

  const matricula =
    document
    .getElementById(
      "matricula"
    )
    .value
    .trim();

  const turma =
    document
    .getElementById(
      "turma"
    )
    .value
    .trim();


  // =====================
  // ⚠ VALIDAÇÃO
  // =====================
  if(

    !nome ||
    !matricula ||
    !turma

  ){

    alert(
      "Preencha todos os campos"
    );

    return;

  }


  // =====================
  // 📦 OBJETO
  // =====================
  const aluno = {

    id:Date.now(),

    nome,
    matricula,
    turma

  };


  // =====================
  // 📚 LISTA
  // =====================
  const alunos =
    JSON.parse(

      localStorage.getItem(
        "alunosEyeGate"
      )

    ) || [];


  alunos.push(aluno);


  // =====================
  // 💾 SALVAR
  // =====================
  localStorage.setItem(

    "alunosEyeGate",

    JSON.stringify(alunos)

  );


  // =====================
  // 🔄 RELOAD
  // =====================
  limparCampos();

  carregarAlunos();

  alert(
    "Aluno cadastrado"
  );

}


// =========================
// 📋 LISTAR
// =========================
function carregarAlunos(){

  const lista =
    document.querySelector(
      ".alunos-list"
    );

  const alunos =
    JSON.parse(

      localStorage.getItem(
        "alunosEyeGate"
      )

    ) || [];


  // limpa
  lista.innerHTML = "";


  // vazio
  if(alunos.length === 0){

    lista.innerHTML = `

      <div class="aluno-item">

        <div class="aluno-info">

          <div class="aluno-avatar">
            👤
          </div>

          <div>

            <strong>
              Nenhum aluno registrado
            </strong>

            <p>
              O sistema iniciará vazio
            </p>

          </div>

        </div>

      </div>

    `;

    return;

  }


  // render
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

  document.getElementById(
    "nome"
  ).value = "";

  document.getElementById(
    "matricula"
  ).value = "";

  document.getElementById(
    "turma"
  ).value = "";

}