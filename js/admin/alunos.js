// =========================
// 🎓 ADMIN ALUNOS
// =========================
async function carregarAlunosAdmin(){

  const container =
    document.getElementById("adminAlunos");

  if(!container) return;

  const { data, error } =
    await supabaseClient

      .from("alunos")

      .select("*");

  if(error){

    console.log(error);

    return;

  }

  container.innerHTML = "";

  data.forEach((aluno)=>{

    container.innerHTML += `

      <div class="user-card">

        <div class="info">

          <strong>
            ${aluno.nome}
          </strong>

          <span>
            ${aluno.turma}
          </span>

          <span>
            ${aluno.matricula}
          </span>

        </div>

        <button
          class="delete-btn"
          onclick="deletarAluno('${aluno.id}')"
        >
          🗑 Excluir
        </button>

      </div>

    `;

  });

}

// =========================
// 🗑 DELETE ALUNO
// =========================
async function deletarAluno(id){

  if(!(await verificarAdminLocal())){

  mostrarMensagem(
    "Sem permissão"
  );

  return;

}

  if(!confirm("Excluir aluno?"))
    return;

  const { error } =
    await supabaseClient

      .from("alunos")

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
    "Aluno removido"
  );

  await carregarAlunosAdmin();

  await carregarStats();

}