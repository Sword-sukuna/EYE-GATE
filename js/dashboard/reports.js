//Buscar alunos 
async function buscarAlunoRelatorio(){

  const busca =
    document
      .getElementById("buscaAluno")
      .value
      .toLowerCase();

  const container =
    document.getElementById("resultadoBusca");

  const { data, error } =
    await supabaseClient
      .from("alunos")
      .select("*");

  if(error){

    console.log(error);
    return;

  }

  const encontrados =
  data.filter(aluno =>

    aluno.nome.toLowerCase().includes(busca) ||

    aluno.matricula.toLowerCase().includes(busca) ||

    aluno.turma.toLowerCase().includes(busca)

  );

  container.innerHTML = "";

  encontrados.forEach(aluno => {

    container.innerHTML += `

      <div class="user-card">

        <div class="info">

          <strong>${aluno.nome}</strong>

          <span>${aluno.turma}</span>

          <span>${aluno.matricula}</span>

        </div>

        <div style="display:flex; gap:10px;">

  <button
    class="login-btn"
    onclick="visualizarPDFAluno('${aluno.nome}')"
  >
    👁 Visualizar
  </button>

  <button
    class="logout-btn"
    onclick="baixarPDFAluno('${aluno.nome}')"
  >
    📥 Baixar
  </button>

</div>

    `;

  });

}

// =========================
// 📄 CRIAR PDF ESTILIZADO
// =========================
async function criarPDFAluno(nomeAluno){
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    try {
        const { data, error } = await supabaseClient
            .from("logs_reconhecimento")           // ← Tabela correta
            .select("*")
            .eq("nome_aluno", nomeAluno)           // ← Coluna correta
            .order("horario", { ascending: false });

        if (error) {
            console.error("Erro ao buscar logs para PDF:", error);
            return null;
        }

        // === RESTO DO CÓDIGO (TOPO, LOGO, etc) continua igual ===
        pdf.setFillColor(20,20,30);
        pdf.rect(0, 0, 210, 35, "F");
// =========================
        // Logo
        try {
            const logo = await carregarLogoBase64();
            pdf.addImage(logo, "PNG", 12, 3, 38, 38);
        } catch(e) {
            console.log("Erro logo:", e);
        }

        // Título
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(24);
        pdf.text("EYE Gate", 50, 17);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("Sistema Inteligente de Reconhecimento Facial", 50, 25);

        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text("RELATÓRIO ESCOLAR", 20, 55);

        pdf.setDrawColor(180);
        pdf.line(20, 60, 190, 60);

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Aluno: ${nomeAluno}`, 20, 75);
        pdf.text(`Total de registros: ${data.length}`, 20, 85);
        pdf.text(`Emitido em: ${new Date().toLocaleString("pt-BR")}`, 20, 95);

        let y = 115;

        if (data.length === 0) {
            pdf.setFontSize(14);
            pdf.text("Nenhum registro encontrado.", 20, y);
            return pdf;
        }

        // Logs
        data.forEach((log, index) => {
            if (y > 250) {
                pdf.addPage();
                y = 20;
            }

            const dataHora = new Date(log.horario);
            const dataFormatada = dataHora.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
            const horaFormatada = dataHora.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" });

            pdf.setDrawColor(220);
            pdf.roundedRect(15, y - 5, 180, 28, 3, 3);

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(13);
            pdf.text(`${index + 1}. ${log.status}`, 25, y + 5);

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(11);
            pdf.text(`Data: ${dataFormatada}`, 25, y + 13);
            pdf.text(`Hora: ${horaFormatada}`, 100, y + 13);

            y += 38;
        });

        // Rodapé
        pdf.setFontSize(9);
        pdf.setTextColor(120);
        pdf.text("Gerado automaticamente pelo sistema EYE Gate", 20, 290);

        return pdf;

    } catch (e) {
        console.error("Erro ao gerar PDF:", e);
        return null;
    }
}

// =========================
// 🖼 CARREGAR LOGO
// =========================
async function carregarLogoBase64(){

  return new Promise((resolve)=>{

    const img = new Image();

    img.src = "./img/logo.png";

    img.onload = ()=>{

      const canvas =
        document.createElement(
          "canvas"
        );

      canvas.width =
        img.width;

      canvas.height =
        img.height;

      const ctx =
        canvas.getContext("2d");

      ctx.drawImage(
        img,
        0,
        0
      );

      resolve(
        canvas.toDataURL(
          "image/png"
        )
      );

    };

  });

}

// pdf viewr
async function visualizarPDFAluno(nomeAluno){

  const pdf =
    await criarPDFAluno(nomeAluno);

  if(!pdf) return;

  const blob =
    pdf.output("blob");

  const url =
    URL.createObjectURL(blob);

  window.open(url, "_blank");

}

// download pdf
async function baixarPDFAluno(nomeAluno){

  const pdf =
    await criarPDFAluno(nomeAluno);

  if(!pdf) return;

  pdf.save(
    `${nomeAluno}_relatorio.pdf`
  );

}