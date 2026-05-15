
window.addEventListener("DOMContentLoaded", ()=>{

  carregarUsuarios();

});


// =========================
// 👥 LISTAR
// =========================
function carregarUsuarios(){

  const container =
    document.getElementById("adminUsers");

  const users =
    JSON.parse(localStorage.getItem("usuariosEyeGate")) || [];

  container.innerHTML = "";


  users.forEach((u,index)=>{

    const card =
      document.createElement("div");

    card.className = "user-card";

    card.innerHTML = `
      <div class="info">
        <strong>${u.nome}</strong>
        <span>${u.email}</span>
      </div>

      <button class="delete-btn" onclick="deletar(${index})">
        🗑
      </button>
    `;

    container.appendChild(card);

  });

}


// =========================
// 🗑 DELETAR
// =========================
function deletar(index){

  const users =
    JSON.parse(localStorage.getItem("usuariosEyeGate")) || [];

  if(confirm("Deseja deletar este usuário?")){

    users.splice(index,1);

    localStorage.setItem(
      "usuariosEyeGate",
      JSON.stringify(users)
    );

    carregarUsuarios();

  }

}


function sairAdmin(){

  const user =
    JSON.parse(localStorage.getItem("usuarioLogado"));

  // volta usuário normal (remove modo admin)
  if(user){

    user.tipo = "user";

    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify(user)
    );

  }

  window.location.href = "./dashboard.html";

}