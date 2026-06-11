// =========================
// 📋 ADMIN LOGS
// =========================
async function carregarLogsAdmin(){

  const container =
    document.getElementById("adminLogs");

  if(!container) return;

  const { data, error } =
    await supabaseClient

      .from("logs")

      .select("*")

      .order("horario",{
        ascending:false
      });

  if(error){

    console.log(error);

    return;

  }

  container.innerHTML = "";

  data.forEach((log)=>{

    container.innerHTML += `

      <div class="user-card">

        <div class="info">

          <strong>
            ${log.aluno}
          </strong>

          <span>
            ${log.status}
          </span>

        </div>

        <button
          class="delete-btn"
          onclick="deletarLog('${log.id}')"
        >
          🗑 Excluir
        </button>

      </div>

    `;

  });

}

// =========================
// 🗑 DELETE LOG
// =========================
async function deletarLog(id){

  if(!(await verificarAdminLocal())){

  mostrarMensagem(
    "Sem permissão"
  );

  return;

}

  if(!confirm("Excluir registro?"))
    return;

  const { error } =
    await supabaseClient

      .from("logs")

      .delete()

      .eq("id", id);

  if(error){

    console.log(error);

    mostrarMensagem(
      "Erro ao excluir"
    );

    return;

  }

  mostrarMensagem(
    "Registro removido"
  );

  await carregarLogsAdmin();

  await carregarStats();

}
