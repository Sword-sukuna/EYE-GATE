// =========================
// 📈 GRAFICO LOGS
// =========================
async function carregarGraficoLogs(){

  const existente =
Chart.getChart("graficoLogs");

if(existente){
  existente.destroy();
}

  const canvas =
    document.getElementById("graficoLogs");

  if(!canvas) return;

  const { data, error } =
    await supabaseClient

      .from("logs")

      .select("horario");

  if(error){

    console.log(error);

    return;

  }

  const dias = {};

  data.forEach((log)=>{

    const dia =
      new Date(log.horario)
      .toLocaleDateString("pt-BR");

    dias[dia] = (dias[dia] || 0) + 1;

  });

if(graficoLogs){
  graficoLogs.destroy();
}

graficoLogs = new Chart(canvas,{

  type: "line",

  data: {

    labels: Object.keys(dias),

    datasets:[{

      label:"Reconhecimentos",

      data:Object.values(dias),

      borderColor:"#6C5CE7",

      backgroundColor:"rgba(108,92,231,0.2)",

      borderWidth:3,

      tension:0.4,

      fill:true,

      pointRadius:5,

      pointHoverRadius:8

    }]

  },

  options: {

    responsive:true,

    maintainAspectRatio:false,

    plugins:{

      legend:{

        labels:{

          color:"#fff"

        }

      }

    },

    scales:{

      x:{

        ticks:{

          color:"#aaa"

        },

        grid:{

          color:"rgba(255,255,255,0.05)"

        }

      },

      y:{

        ticks:{

          color:"#aaa"

        },

        grid:{

          color:"rgba(255,255,255,0.05)"

        }

      }

    }

  }

});

}