// =========================
// 👁 LOGIN
// =========================
function iniciarLogin(){

  const form =
    document.getElementById("loginForm");

  if(!form) return;

  form.addEventListener(

    "submit",

    async (e)=>{

      e.preventDefault();

      await fazerLogin();

    }

  );

}


// =========================
// 🔐 LOGIN ADMIN
// =========================
function iniciarAdminLogin(){

  const form =
    document.getElementById("adminForm");

  if(!form) return;

  form.addEventListener(

    "submit",

    async (e)=>{

      e.preventDefault();

      await fazerLoginAdmin();

    }

  );

}

// =========================
// 🔐 LOGIN ADMIN
// =========================
async function fazerLoginAdmin(){

  mostrarLoading("Entrando como admin...");

  try{

    const email =
      document
        .getElementById("adminEmail")
        .value
        .trim();

    const senha =
      document
        .getElementById("adminSenha")
        .value
        .trim();

    const { data:admin, error } =
      await supabaseClient

        .from("admins")

        .select("*")

        .eq("email", email)

        .eq("senha", senha)

        .maybeSingle();

    if(error || !admin){

      mostrarMensagem(
        "Acesso negado"
      );

      return;

    }

    localStorage.setItem(

"usuarioLogado",

JSON.stringify({

 id:admin.id,
 nome:"Administrador",
 tipo:"admin",
 email:admin.email

})

);

    carregarUsuario();

    controlarPermissoes();

    verificarAdmin();

    await carregarStats();

    await carregarAlunosAdmin();

    await carregarLogsAdmin();

    await carregarUsuarios();

    await carregarLogs();

    mostrarMensagem(
      "Bem-vindo Admin!"
    );

    abrirPagina("dashboardPage");

  }finally{

    esconderLoading();

  }

}

// =========================
// 🚪 LOGIN USER
// =========================
async function fazerLogin(){

  mostrarLoading("Entrando...");

  try{

    const email =
      document
        .getElementById("email")
        .value
        .trim();

    const senha =
      document
        .getElementById("senha")
        .value
        .trim();

    if(!email || !senha){

      mostrarMensagem(
        "Preencha os campos"
      );

      return;

    }

    const { data:user, error } =
      await supabaseClient

        .from("usuarios")

       .select("*")

        .eq("email", email)

        .eq("senha", senha)

        .maybeSingle();

    if(error || !user){

      mostrarMensagem(
        "Login inválido"
      );

      return;

    }

    localStorage.setItem(

      "usuarioLogado",

      JSON.stringify(user)

    );

    carregarUsuario();

    controlarPermissoes();

    await carregarStats();

    mostrarMensagem(
      "Login realizado"
    );

    abrirPagina("dashboardPage");

  }finally{

    esconderLoading();

  }

}