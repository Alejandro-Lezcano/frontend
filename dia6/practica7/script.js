
document.getElementById('igual').addEventListener('click',function(){
    var n1 = parseFloat(document.getElementById('num1').value);
    var n2 = parseFloat(document.getElementById('num2').value);
    var op = document.getElementById('operacion').value;
    var res = 0;
    if(op == "suma"){
        res = n1 + n2;
    }else if(op == "resta"){
        res = n1 - n2;
    }else  if(op == "multiplicacion"){
        res = n1 * n2;
    }else if(op == "division"){
        res = n1 / n2;
    }
    display = document.getElementById("resultado");
    display.value = res;
});