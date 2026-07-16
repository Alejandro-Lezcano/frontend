document.getElementById("agregar").addEventListener("click", () => {
    const texto = document.getElementById("nuevaTarea").value;
    if (texto.trim() === "") return;
    const li = document.createElement("li");
    li.textContent = texto;
    document.getElementById("listaTareas").appendChild(li);
});