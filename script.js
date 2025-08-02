document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("participacion-form");
  const mensaje = document.getElementById("mensaje");
  const boton = document.getElementById("botonSubmit");
  const server = "https://script.google.com/macros/s/AKfycbw9HW1qVOa87KJ3M_KUqx_Z5fMB1yCFXm2r-GW1lvDi7D0iWBgbdBXqPk6SrcIoPLOO/exec";


  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (boton.classList.contains('bloqueado')) return;

    // Mostrar loader y bloquear visualmente
    boton.innerHTML = 'Enviando <span class="loader"></span>';
    boton.classList.add('bloqueado');

    const cedula = form.querySelector('input[name="cedula"]').value.trim();

    if (await verificarCedulaRegistrada(cedula)) {
      // opcion de cuando el usuario ya esta previamente registrado.
      mensaje.textContent = "Hubo un error al enviar el formulario. El usuario ya está registrado.";
      boton.innerHTML = 'ENVIAR Y PARTICIPAR';
      boton.classList.remove('bloqueado');
    } else {
      // opcion cuando el usuario es la primera ves que se registra.
      const data = new FormData(form);
      data.append("funcion", "submit-entry");    

      fetch(server, {
        method: "POST",
        body: data,
        mode: "no-cors"
      })
      .then(() => {
        mensaje.textContent = "Formulario enviado correctamente. ¡Gracias por confirmar!";
        form.reset();
        window.location.href = "participacionResgistrada.html";
      })
      .catch((error) => {
        mensaje.textContent = "Hubo un error al enviar el formulario.";
        console.error("Error:", error);
      })
    }
  });
});

async function verificarCedulaRegistrada(cedula) {
  const formData = new FormData();
  formData.append("funcion", "verify-ID");
  formData.append("cedula", cedula);

  try {
    const response = await fetch(server, {
      method: "POST",
      body: formData,
    });

    const texto = await response.text();
    const resultado = JSON.parse(texto);
    return resultado.registrado === true;
  } catch (error) {
    console.error("Error verificando cédula:", error);
    return false;
  }
}

