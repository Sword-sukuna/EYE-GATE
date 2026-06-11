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