// =========================
// 👁 EYE GATE - REGISTRO
// =========================


// =========================
// 🚀 INICIAR
// =========================
window.addEventListener(

  "DOMContentLoaded",

  ()=>{

    const form =
      document.getElementById(
        "registroForm"
      );

    form.addEventListener(
      "submit",
      criarConta
    );

  }

);


// =========================
// 👤 CRIAR CONTA
// =========================
function criarConta(event){

  event.preventDefault();


  const nome =
    document.getElementById(
      "nome"
    ).value;

  const email =
    document.getElementById(
      "email"
    ).value;

  const senha =
    document.getElementById(
      "senha"
    ).value;

  const confirmar =
    document.getElementById(
      "confirmarSenha"
    ).value;


  // =========================
  // 🔒 VALIDAÇÃO
  // =========================
  if(senha !== confirmar){

    alert(
      "As senhas não coincidem!"
    );

    return;

  }


  // =========================
  // 📦 PEGAR USUÁRIOS
  // =========================
  const usuarios =
    JSON.parse(

      localStorage.getItem(
        "usuariosEyeGate"
      )

    ) || [];


  // =========================
  // ❌ VERIFICAR DUPLICADO
  // =========================
  const existe =
    usuarios.find(
      u => u.email === email
    );


  if(existe){

    alert(
      "Este email já está cadastrado!"
    );

    return;

  }


  // =========================
  // ➕ CRIAR USUÁRIO
  // =========================
  const novoUsuario = {

  nome,
  email,
  senha,

  foto: "",

  tipo: "user"

};


  usuarios.push(novoUsuario);


  localStorage.setItem(

    "usuariosEyeGate",

    JSON.stringify(
      usuarios
    )

  );

const admin = {

  nome: "Administrador",

  email: "raul.carmo.rosa@adm.com",

  senha: "Silvano@rosa10",

  foto: "",

  tipo: "admin"

};

localStorage.setItem(
  "adminEyeGate",
  JSON.stringify(admin)
);


  // =========================
  // ✅ SUCESSO
  // =========================
  alert(
    "Conta criada com sucesso!"
  );


  // =========================
  // 🔁 IR PARA LOGIN
  // =========================
  window.location.href =
    "./login.html";

}