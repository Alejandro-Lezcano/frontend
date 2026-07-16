
var contenido = document.getElementById('contenido');

document.getElementById('agrandar').addEventListener('click', function(){
    // window.getComputedStyle obtiene el estilo real renderizado por el navegador
    var estiloActual = window.getComputedStyle(contenido).fontSize;
    var actual = parseInt(estiloActual);
    contenido.style.fontSize = (actual + 2) + 'px';
});

document.getElementById('achicar').addEventListener('click', function(){
    var estiloActual = window.getComputedStyle(contenido).fontSize;
    var actual = parseInt(estiloActual);
    contenido.style.fontSize = (actual - 2) + 'px';
});