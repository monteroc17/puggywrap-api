function Importar(...funciones) {
    funciones.forEach(funcion => {
        const script = document.createElement('script');
        script.src = `http://68.183.100.14:8000/fn-${funcion[0]}?version=${funcion[1]}`;
        document.body.appendChild(script);
    });
}