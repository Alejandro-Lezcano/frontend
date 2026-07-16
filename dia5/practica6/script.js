lista = new Array("images/producto1.jpg","images/producto2.webp","images/producto3.avif");
indice = 0;
galeria = document.getElementById('galeria');
galeria.src = "images/producto1.jpg";
function cambiarImagen(event){
    if(event.target.id == "btn-siguiente"){
        x = 1;
    }else{
        x = -1;
    }
    indice = indice + x;

    if(indice >= lista.length){
        indice = 0;
    }else if(indice < 0 ){
        indice = lista.length -1;
    }
    
    galeria.src = lista[indice];
}

botonAnterior = document.getElementById('btn-anterior');
botonAnterior.addEventListener('click', cambiarImagen);
botonSiguiente = document.getElementById('btn-siguiente');
botonSiguiente.addEventListener('click', cambiarImagen);