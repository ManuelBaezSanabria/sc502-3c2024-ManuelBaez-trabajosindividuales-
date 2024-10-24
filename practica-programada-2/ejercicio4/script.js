function verificarEdad() {
    const edad = parseInt(document.getElementById('edad').value);
    let mensaje;
    if (edad >= 18) {
        mensaje = "Eres mayor de edad";
    } else {
        mensaje = "Eres menor de edad";
    }

    document.getElementById('resultado').innerText = mensaje;
}
