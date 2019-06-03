function Importar(...funciones) {
    funciones.forEach(funcion => {
        const script = document.createElement('script');
        script.src = `http://localhost:3000/fn-${funcion}`;
        document.body.appendChild(script);
    });
}