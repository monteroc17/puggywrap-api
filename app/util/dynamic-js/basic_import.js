function Importar(...funciones) {
    funciones.forEach(funcion => {
        const script = document.createElement('script');
        script.src = `http://www.puggywrap.tk/fn-${funcion[0]}?version=${funcion[1]}`;
        document.body.appendChild(script);
    });
}