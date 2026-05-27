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
// 📝 REGISTRO
// =========================
function iniciarRegistro(){

  const form =
    document.getElementById("registroForm");

  if(!form) return;

  form.addEventListener(

    "submit",

    async (e)=>{

      e.preventDefault();

      await registrarUsuario();

    }

  );

}

// =========================
// 👤 REGISTRAR USUÁRIO
// =========================
async function registrarUsuario(){

  const nome =
    document
      .getElementById("registroNome")
      .value
      .trim();

  const email =
    document
      .getElementById("registroEmail")
      .value
      .trim();

  const senha =
    document
      .getElementById("registroSenha")
      .value
      .trim();

  if(!nome || !email || !senha){

    mostrarMensagem(
      "Preencha todos os campos"
    );

    return;

  }

  const { data:existe } =
    await supabaseClient

      .from("usuarios")

      .select("id")

      .eq("email", email);

  if(existe && existe.length > 0){

    mostrarMensagem(
      "Email já cadastrado"
    );

    return;

  }

  const { error } =
    await supabaseClient

      .from("usuarios")

      .insert([{

        nome,
        email,
        senha,
        tipo:"usuario"

      }]);

  if(error){

    console.log(error);

    mostrarMensagem(
      "Erro ao cadastrar"
    );

    return;

  }

  mostrarMensagem(
    "Conta criada"
  );

  abrirPagina("loginPage");

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
// 👤 USER INFO
// =========================
function carregarUsuario(){

  const user =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  if(!user) return;

  const nome =
    document.getElementById("userName");

  const tipo =
    document.getElementById("userType");

  if(nome){

    nome.innerText =
      user.nome;

  }

  if(tipo){

    tipo.innerText =

      user.tipo === "admin"

      ? "Administrador"

      : "Usuário";

  }

}

// =========================
// 🚪 LOGOUT
// =========================
function logout(){

  localStorage.removeItem(
    "usuarioLogado"
  );

  abrirPagina("loginPage");

}