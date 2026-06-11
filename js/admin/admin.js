// =========================
// 🔐 ADMIN PANEL
// =========================
function verificarAdmin(){

  const user =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  const itens =
    document.querySelectorAll(".admin-only");

  itens.forEach((el)=>{

    el.style.display = "none";

  });

  if(user && user.tipo === "admin"){

    itens.forEach((el)=>{

      el.style.display = "block";

    });

  }

}

// =========================
// 🔐 ADMIN ONLY
// =========================
function controlarPermissoes(){

  const user =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  const itens =
    document.querySelectorAll(".admin-only");

  itens.forEach((el)=>{

    el.style.display = "none";

  });

  if(user && user.tipo === "admin"){

    itens.forEach((el)=>{

      el.style.display = "block";

    });

  }

}

async function verificarAdminLocal(){

  const user =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  if(!user)
    return false;

  const { data } =
    await supabaseClient

      .from("admins")

      .select("email")

      .eq("email", user.email)

      .maybeSingle();

  return !!data;

}

//=============//
// Validar adm //
//=============//
async function validarAdminBanco(){

  const adminId =
    localStorage.getItem("adminLogado");

  if(!adminId)
    return false;

  const { data } =
    await supabaseClient
      .from("admins")
      .select("id")
      .eq("id", adminId)
      .single();

  return !!data;

}
