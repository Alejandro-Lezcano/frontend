var TELEFONO = '595992871042'
var producto = document.querySelectorAll('.producto');

producto.forEach(function(producto){
    producto.addEventListener('click', function(){
        var nombre = producto.getAttribute('data-nombre');
        var mensaje = 'Hola, me interesa: ' + nombre;
        var url = 'https://wa.me/' + TELEFONO + '?text=' + encodeURIComponent(mensaje);
        window.open(url, '_blank');
    });
}); 