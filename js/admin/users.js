// =========================
// 👥 ADMIN USERS
// =========================
async function carregarUsuarios(){

  const container =
    document.getElementById("adminUsers");

  if(!container) return;

  const { data:users, error } =
    await supabaseClient

      .from("usuarios")

     .select("id,nome,email");

  if(error){

    console.log(error);

    return;

  }

  container.innerHTML = "";

  users.forEach((u)=>{

    const card =
      document.createElement("div");

    card.className =
      "user-card";

    card.innerHTML = `

      <div class="info">

        <strong>
          ${u.nome}
        </strong>

        <span>
          ${u.email}
        </span>

      </div>

      <button
        class="delete-btn"
        onclick="deletarUsuario('${u.id}')"
      >
        🗑
      </button>

    `;

    container.appendChild(card);

  });

}

// =========================
// 🗑 DELETE USER
// =========================
async function deletarUsuario(id){

  if(!(await verificarAdminLocal())){

  mostrarMensagem(
    "Sem permissão"
  );

  return;

}

  if(!confirm("Deseja deletar?"))
    return;

  const { error } =
    await supabaseClient

      .from("usuarios")

      .delete()

      .eq("id", id);

  if(error){

    console.log(error);

    mostrarMensagem(
      "Erro ao deletar"
    );

    return;

  }

  mostrarMensagem(
    "Usuário removido"
  );

  await carregarUsuarios();

  await carregarLogs();

  await carregarStats();

}