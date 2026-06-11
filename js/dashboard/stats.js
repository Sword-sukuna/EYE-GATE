// =========================
// 📊 STATS
// =========================
async function carregarStats(){

  // USERS
  const {
    data:usuarios
  } = await supabaseClient

    .from("usuarios")
   .select("id");

  // ALUNOS
  const {
    data:alunos
  } = await supabaseClient

    .from("alunos")
   .select("id");

  // LOGS
  const {
    data:logs
  } = await supabaseClient

    .from("logs")
   .select("id");

  // USERS
  const totalUsers =
    document.getElementById(
      "totalUsers"
    );

  if(totalUsers){

    totalUsers.innerText =
      usuarios?.length || 0;

  }

  // ALUNOS
  const totalAlunos =
    document.getElementById(
      "totalAlunos"
    );

  if(totalAlunos){

    totalAlunos.innerText =
      alunos?.length || 0;

  }

  // RECONHECIMENTOS
  const totalReconhecimentos =
    document.getElementById(
      "totalReconhecimentos"
    );

  if(totalReconhecimentos){

    totalReconhecimentos.innerText =
      logs?.length || 0;

  }

  // LOGS
  const totalLogs =
    document.getElementById(
      "totalLogs"
    );

  if(totalLogs){

    totalLogs.innerText =
      logs?.length || 0;

  }

}
