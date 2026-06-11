// =========================
// 📷 CAMERA CADASTRO
// =========================
async function iniciarCameraCadastro(){

 const video =
 document.getElementById("video");

 if(!video)
   return;

 if(streamCadastro)
   return;

 try{

   streamCadastro =
   await navigator.mediaDevices.getUserMedia({

     video:true,

     audio:false

   });

   video.srcObject =
   streamCadastro;

  }catch(error){

  console.log(error);

  mostrarMensagem(
    "Permita acesso à câmera para continuar."
  );

}

}

// =========================
// 📷 CAMERA MONITOR
// =========================
async function iniciarCameraMonitor(){

 const video =
 document.getElementById(
   "monitorVideo"
 );

 if(!video)
   return;

 if(streamMonitor)
   return;

 try{

   streamMonitor =
   await navigator.mediaDevices.getUserMedia({

     video:true,

     audio:false

   });

   video.srcObject =
   streamMonitor;

  }catch(error){

  console.log(error);

  mostrarMensagem(
    "Permita acesso à câmera para continuar."
  );

}

}

function pararCameraCadastro(){

 if(!streamCadastro)
   return;

 streamCadastro
   .getTracks()
   .forEach(track => track.stop());

 streamCadastro = null;

}

function pararCameraMonitor(){

 if(!streamMonitor)
   return;

 streamMonitor
   .getTracks()
   .forEach(track => track.stop());

 streamMonitor = null;

}
