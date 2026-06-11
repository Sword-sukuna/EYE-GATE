//KEEP_LIVE//

async function keepAlive() {

  try {

    const { error } =
      await supabaseClient

        .from("usuarios")

        .select("id")

        .limit(1);

    if(error){

      console.log(
        "keep-alive erro:",
        error.message
      );

    }else{

      console.log(
        "💚 keep-alive ok"
      );

    }

  }catch(e){

    console.log(
      "keep-alive falhou",
      e
    );

  }

}

// 30 minutos
setInterval(keepAlive, 1000 * 60 * 30);

// roda uma vez ao iniciar também
keepAlive();