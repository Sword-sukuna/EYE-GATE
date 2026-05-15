// =========================
// 👁 EYE GATE REGISTROS
// =========================


// =========================
// 🚀 INICIAR
// =========================
window.addEventListener(

  "DOMContentLoaded",

  ()=>{

    carregarRegistros();

    iniciarBusca();

  }

);


// =========================
// 📋 CARREGAR
// =========================
function carregarRegistros(){

  const body =
    document.getElementById(
      "registrosBody"
    );

  const alunos =
    JSON.parse(

      localStorage.getItem(
        "alunosEyeGate"
      )

    ) || [];


  // limpa
  body.innerHTML = "";


  // vazio
  if(alunos.length === 0){

    body.innerHTML = `

      <tr>

        <td colspan="5">

          Nenhum registro encontrado

        </td>

      </tr>

    `;

    return;

  }


  // render
  alunos.forEach((aluno,index)=>{

    const tipo =

      index % 2 === 0

      ?

      "Entrada"

      :

      "Saída";


    const status =

      tipo === "Entrada"

      ?

      "success"

      :

      "warning";


    const hora =
      gerarHorarioFake();


    body.innerHTML += `

      <tr>

        <td>
          ${aluno.nome}
        </td>

        <td>
          ${aluno.turma}
        </td>

        <td>
          ${tipo}
        </td>

        <td>
          ${hora}
        </td>

        <td>

          <span
            class="
              status
              ${status}
            "
          >

            ${tipo}

          </span>

        </td>

      </tr>

    `;

  });

}


// =========================
// 🔎 BUSCA
// =========================
function iniciarBusca(){

  const botao =
    document.querySelector(
      ".buscar-btn"
    );

  botao.addEventListener(

    "click",

    buscarAluno

  );

}


// =========================
// 👤 BUSCAR
// =========================
function buscarAluno(){

  const texto =
    document
    .querySelector(
      ".filtro-group input"
    )
    .value
    .toLowerCase();


  const linhas =
    document.querySelectorAll(
      "#registrosBody tr"
    );


  linhas.forEach((linha)=>{

    const nome =
      linha.innerText
      .toLowerCase();

    // mostrar
    if(

      nome.includes(texto)

    ){

      linha.style.display =
        "";

    }else{

      linha.style.display =
        "none";

    }

  });

}


// =========================
// 🕒 HORÁRIO FAKE
// =========================
function gerarHorarioFake(){

  const hora =
    Math.floor(
      Math.random() * 24
    );

  const minuto =
    Math.floor(
      Math.random() * 60
    );

  return `

    ${
      String(hora)
      .padStart(2,"0")
    }

    :

    ${
      String(minuto)
      .padStart(2,"0")
    }

  `;

}