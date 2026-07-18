class Juego {
    constructor(){
        this.app = null;
        this.mundo = null;
    }

    async arrancar(){
        const opcionesDePixi = {
            resizeTo: window,
            background: "#000000"
        };
        console.log("arrancando");
        this.app = new PIXI.Application();
        await this.app.init(opcionesDePixi);

        this.mundo = new PIXI.Container();

        window.__PIXI_APP__ = this.app;

        document.body.appendChild(this.app.canvas);
    }
}

const nuevoJuego = new Juego();

nuevoJuego.arrancar();