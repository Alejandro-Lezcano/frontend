var audio = document.getElementById('musica');

document.getElementById('btnAudio').addEventListener('click', function() {
  audio.play();
});

var fechaConcierto = new Date('2026-06-13');

function actualizarContador() {
    var hoy  = new Date();
    var diff = fechaConcierto - hoy;
    var dias = Math.ceil(diff / (1000 * 60 * 60 * 24));

    var texto;

    if (dias > 0) {
        texto = 'Faltan ' + dias + ' dias para el encuentro';
    } else {
        texto = 'Hoy es el concierto!';
    }

    document.getElementById('contador').innerHTML = texto;
}

actualizarContador();
setInterval(actualizarContador, 1000 * 60);