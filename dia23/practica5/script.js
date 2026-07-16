document.getElementById("formulario").addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("mensaje").textContent = "Formulario enviado correctamente";
})