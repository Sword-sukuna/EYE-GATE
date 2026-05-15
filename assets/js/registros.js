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
// 📋 MOCK REGISTROS
// =========================
if(

  !localStorage.getItem(
    "eyeGateRegistros"
  )

){

  const mock = [

    {

      nome:
        "Lucas Ferreira",

      matricula:
        "2026001",

      tipo:
        "Entrada",

      horario:
        "07:12",

      data:
        "15/05/2026",

      status:
        "online"

    },

    {

      nome:
        "Mariana Costa",

      matricula:
        "2026002",

      tipo:
        "Saída",

      horario:
        "12:03",

      data:
        "15/05/2026",

      status:
        "offline"

    },

    {

      nome:
        "Pedro Henrique",

      matricula:
        "2026003",

      tipo:
        "Entrada",

      horario:
        "07:05",

      data:
        "15/05/2026",

      status:
        "online"

    }

  ];


  localStorage.setItem(

    "eyeGateRegistros",

    JSON.stringify(
      mock
    )

  );

}


// =========================
// 📋 CARREGAR
// =========================
function carregarRegistros(){

  const tbody =
    document.getElementById(
      "tableBody"
    );

  const registros =
    JSON.parse(

      localStorage.getItem(
        "eyeGateRegistros"
      )

    ) || [];


  tbody.innerHTML = "";


  registros.forEach(

    registro=>{

      const tr =
        document.createElement(
          "tr"
        );

      tr.innerHTML = `

        <td>
          👤 ${registro.nome}
        </td>

        <td>
          ${registro.matricula}
        </td>

        <td>
          ${registro.tipo}
        </td>

        <td>
          ${registro.horario}
        </td>

        <td>
          ${registro.data}
        </td>

        <td>

          <span
            class="
              status
              ${registro.status}
            "
          >

            ${

              registro.status
              ===
              "online"

              ?

              "Na escola"

              :

              "Fora"

            }

          </span>

        </td>

      `;

      tbody.appendChild(
        tr
      );

    }

  );

}


// =========================
// 🔍 FILTRAR
// =========================
function filtrarRegistros(){

  const busca =
    document
    .getElementById(
      "searchInput"
    )
    .value
    .toLowerCase();

  const tipo =
    document
    .getElementById(
      "typeFilter"
    )
    .value;


  const linhas =
    document.querySelectorAll(
      "#tableBody tr"
    );


  linhas.forEach(

    linha=>{

      const texto =
        linha.innerText
        .toLowerCase();

      const possuiNome =
        texto.includes(
          busca
        );

      const possuiTipo =

        tipo === ""

        ||

        texto.includes(
          tipo.toLowerCase()
        );


      if(

        possuiNome
        &&
        possuiTipo

      ){

        linha.style.display =
          "";

      }else{

        linha.style.display =
          "none";

      }

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

    carregarRegistros();

  }

);