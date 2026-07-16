contenedor = document.getElementById('container');

contenedor.innerHTML = "<button id='cambiar_fondo'> Cambiar de color</button>";

boton = document.getElementById('cambiar_fondo');

boton.addEventListener('click',function(){
    document.body.style.backgroundColor = 'skyblue';
});
