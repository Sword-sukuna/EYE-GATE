// =========================
// 📋 CARREGAR LOGS
// =========================
async function carregarLogs(){

  const tabela =
    document.getElementById("logsTable");

  if(!tabela) return;

  const { data, error } =
    await supabaseClient

      .from("logs")

      .select("id,aluno,status,horario")

      .order("horario", {
        ascending:false
      });

  if(error){

    console.log(error);

    return;

  }

  tabela.innerHTML = "";

  data.forEach((log)=>{

  const horario = new Date(log.horario)
.toLocaleString("pt-BR", {
  timeZone: "America/Sao_Paulo"
});

    tabela.innerHTML += `

      <tr>

       <td>${log.aluno}</td>

        <td>${log.status}</td>

        <td>${horario}</td>

      </tr>

    `;

  });

}

// =========================
// 🧹 LIMPAR LOGS ANTIGOS (DIÁRIO)
// =========================
async function limparLogsAntigos() {
    try {
        const hoje = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD

        // Apaga todos os logs onde a data é ANTERIOR a hoje
        const { error } = await supabaseClient
            .from("logs")
            .delete()
            .lt("horario", `${hoje}T00:00:00`);

        if (error) {
            console.error("Erro ao limpar logs antigos:", error);
        } else {
            console.log(`✅ Logs antigos (antes de ${hoje}) foram apagados`);
        }
    } catch (e) {
        console.error("Erro na limpeza diária:", e);
    }
}

// ====================== AUTO LIMPEZA DIÁRIA ======================
async function iniciarLimpezaDiaria() {
    await limparLogsAntigos(); // Limpa ao carregar a página

    // Verifica a cada 5 minutos se mudou o dia
    setInterval(async () => {
        const agora = new Date();
        const hora = agora.getHours();
        const minuto = agora.getMinutes();

        // Executa à meia-noite ou logo no início do dia
        if (hora === 0 && minuto < 10) {
            await limparLogsAntigos();
        }
    }, 300000); // 5 minutos
}

function logSistema(tipo, mensagem){

  const registro = {

    horario: new Date().toLocaleTimeString(),

    tipo,

    mensagem

  };

  window.debugLogs.push(registro);

  console.log(
    `[${tipo}]`,
    mensagem
  );

}
logSistema(
  "TESTE",
  "Sistema iniciado"
);