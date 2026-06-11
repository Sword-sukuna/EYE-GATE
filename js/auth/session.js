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

//================//
// Iniciar sessão //
//================//
function verificarSessao(){

 try{

  const user =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  if(!user)
    return;

  carregarUsuario();

  controlarPermissoes();

  abrirPagina(
    "dashboardPage"
  );

 }catch{

  localStorage.removeItem(
    "usuarioLogado"
  );

 }

}