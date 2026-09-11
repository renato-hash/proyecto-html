document.addEventListener('DOMContentLoaded', () => {
    const btnEnviar = document.getElementById('btnEnviarSoporte');
    const formSoporte = document.getElementById('formSoporte');
    const mensajeExito = document.getElementById('mensajeExito');

    if (btnEnviar && formSoporte && mensajeExito) {
        btnEnviar.addEventListener('click', () => {
            // Revisa si los campos están llenos
            if (!formSoporte.checkValidity()) {
                formSoporte.reportValidity(); // Muestra los avisos rojos si falta algo
                return;
            }

            // Muestra el mensaje verde debajo del botón
            mensajeExito.style.display = 'block';

            // Limpia las casillas del formulario
            formSoporte.reset();
        });
    }
});