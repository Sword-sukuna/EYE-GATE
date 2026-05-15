// =========================
// 👁 DASHBOARD EYE GATE
// =========================


window.addEventListener("DOMContentLoaded", ()=>{

  carregarUsuario();
  carregarStats();
  verificarAdmin();

});


// =========================
// 👤 USUÁRIO
// =========================
function carregarUsuario(){

  const user =
    JSON.parse(localStorage.getItem("usuarioLogado"));

  if(!user){
    window.location.href = "./login.html";
    return;
  }


  document.getElementById("userName").innerText = user.nome;

  document.getElementById("userType").innerText =
    user.tipo === "admin" ? "Administrador" : "Usuário";


  const avatar = document.querySelector(".user-avatar");

  if(user.foto){
    avatar.innerHTML = `
      <img src="${user.foto}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">
    `;
  }

}


// =========================
// 📊 STATS
// =========================
function carregarStats(){

  const users =
    JSON.parse(localStorage.getItem("usuariosEyeGate")) || [];

  document.getElementById("totalUsers").innerText = users.length;

}


// =========================
// 🔐 ADMIN PANEL
// =========================
function verificarAdmin(){

  const user =
    JSON.parse(localStorage.getItem("usuarioLogado"));

  if(user && user.tipo === "admin"){

    document.getElementById("adminPanel").style.display = "block";

  }

}


// =========================
// 👥 LISTAR USERS
// =========================
function listarUsuarios(){

  const users =
    JSON.parse(localStorage.getItem("usuariosEyeGate")) || [];

  console.log(users);
  alert("Usuários no console (F12)");

}


// =========================
// 🗑 GERENCIAR CONTAS
// =========================
function abrirGerenciador(){

  const users =
    JSON.parse(localStorage.getItem("usuariosEyeGate")) || [];

  const lista =
    users.map((u,i)=>
      `${i} - ${u.nome} (${u.email})`
    ).join("\n");

  const index = prompt(
    "Digite o número do usuário para deletar:\n\n" + lista
  );

  if(index === null) return;

  users.splice(index,1);

  localStorage.setItem(
    "usuariosEyeGate",
    JSON.stringify(users)
  );

  alert("Usuário removido!");

  location.reload();

}


// =========================
// ⚠ RESET SISTEMA
// =========================
function resetSistema(){

  if(confirm("Resetar TUDO?")){

    localStorage.clear();
    window.location.href = "./login.html";

  }

}


// =========================
// 🚪 LOGOUT
// =========================
function logout(){

  localStorage.removeItem("usuarioLogado");

  window.location.href = "./login.html";

}

function toggleAdminPanel(){

  const panel =
    document.getElementById("adminPanel");

  panel.style.display =
    panel.style.display === "none"
    || panel.style.display === ""
    ? "block"
    : "none";

}

// =========================
// 🔐 LISTAR USUÁRIOS (UI)
// =========================
function listarUsuarios(){

  const usuarios =
    JSON.parse(
      localStorage.getItem("usuariosEyeGate")
    ) || [];

  const container =
    document.getElementById("userList");

  container.innerHTML = "";


  if(usuarios.length === 0){

    container.innerHTML = `
      <p style="color:#94a3b8;font-size:13px;">
        Nenhum usuário encontrado
      </p>
    `;

    return;

  }


  usuarios.forEach((u,index)=>{

    const card =
      document.createElement("div");

    card.className = "user-card";

    card.innerHTML = `

      <div class="info">

        <strong>${u.nome}</strong>

        <span>${u.email}</span>

      </div>

      <button class="delete-btn"
        onclick="deletarUsuario(${index})"
      >
        🗑
      </button>

    `;

    container.appendChild(card);

  });

}


// =========================
// 🗑 DELETAR USUÁRIO REAL
// =========================
function deletarUsuario(index){

  const usuarios =
    JSON.parse(
      localStorage.getItem("usuariosEyeGate")
    ) || [];


  const confirmacao =
    confirm("Tem certeza que deseja deletar este usuário?");


  if(!confirmacao) return;


  usuarios.splice(index,1);


  localStorage.setItem(
    "usuariosEyeGate",
    JSON.stringify(usuarios)
  );


  listarUsuarios();

  document.getElementById("totalUsers").innerText =
    usuarios.length;

}