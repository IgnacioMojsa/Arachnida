class Juego {
    constructor(){
        this.app = null;
        this.mundo = null;
        this.pantallaInicial = null;
        this.jugador = null;
        this.nuevoAhora = performance.now();
    }

    async precargarAssets(){
        this.fondoJuego = await PIXI.Assets.load("assets/escenario.png");
        this.aspectoJugador = await PIXI.Assets.load("assets/Arachnida.png");
    }

    async arrancar(){
        const opcionesDePixi = {
            resizeTo: window,
            background: "#000000"
        };

        console.log("arrancando");
        this.app = new PIXI.Application();
        await this.app.init(opcionesDePixi);

        window.__PIXI_APP__ = this.app;

        document.body.appendChild(this.app.canvas);

        this.pantallaInicial = new Inicio(this.app);
        await this.pantallaInicial.arrancar();
        
        this.configurarTeclado();
    }

    async empezarPartida(){
        this.pantallaInicial.destruir();
        
        this.mundo = new PIXI.Container();
        this.mundo.sortableChildren = true;
        this.app.stage.addChild(this.mundo);
        
        await this.precargarAssets();
        await this.cargarFondo();
        await this.cargarJugador();

        this.app.ticker.add(() => this.gameLoop());
    }

    async cargarFondo(){
        this.fondo = new PIXI.Sprite(this.fondoJuego); 
        this.fondo.zIndex = 0;
        this.mundo.addChild(this.fondo);

        console.log("Fondo cargado")
    }

    async cargarJugador(){
        this.jugador = new Jugador(window.innerWidth/2, window.innerHeight - 400, this.aspectoJugador);
        this.mundo.addChild(this.jugador.container);
    }

    configurarTeclado(){
        window.addEventListener('keydown', (e) => {
            if (e.key in keys){
                keys[e.key] = true;
                e.preventDefault();
            }

            if ((e.key === "p" || e.key === "P") && this.pantallaInicial && !this.mundo) {
                this.empezarPartida();
            }
        });

        window.addEventListener('keyup', (e) => {
          if (e.key in keys){
            keys[e.key] = false;
            e.preventDefault();
            }
        });

        window.inputKeys = window.inputKeys || {};
        window.addEventListener('keydown', (e) => { window.inputKeys[e.key.toLowerCase()] = true; });
        window.addEventListener('keyup',   (e) => { window.inputKeys[e.key.toLowerCase()] = false; });
    }

    gameLoop() {
        const ahora = performance.now();
        if(!this.nuevoAhora) this.nuevoAhora = ahora;
        
        const dt = Math.min(0.05, (ahora - this.nuevoAhora) / 1000);
        if (isNaN(dt) || dt > 0.1) dt = 1/60;
        this.nuevoAhora = ahora;
        
        this.jugador.inputTeclado(dt, keys);

        //this.jugador.mantenerEnPantalla(300, this.fondo.width, this.fondo.height + 50);
        this.jugador.update(dt);

        //actualizarInterfaz();
        //actualizarPuntaje();

        /*
        for (let i = 0; i < this.arrayDeNpc.length; i++){
            this.arrayDeNpc[i].update(dt);
            this.resolverColisiones(this.arrayDeNpc[i]);
        }
        */
    }
}

class Inicio{
    constructor(unaApp){
        this.app = unaApp;
        this.contenedor = new PIXI.Container();
        this.pantallaInicial = null;
        this.paginasDeBestiario = [];
        this.paginaActualBestiario = null;
    }

    async precargarAssets(){
        this.pantallaInicialSprite = await PIXI.Assets.load("assets/Inicio1.png");
        this.bestiario1 = await PIXI.Assets.load("assets/Bestiario1.png");
        this.bestiario2 = await PIXI.Assets.load("assets/Bestiario2.png");
        this.bestiario3 = await PIXI.Assets.load("assets/Bestiario3.png");
    }

    async cargarBestiario(){
        this.pagina1 = new PIXI.Sprite(this.bestiario1);
        this.pagina2 = new PIXI.Sprite(this.bestiario2);
        this.pagina3 = new PIXI.Sprite(this.bestiario3);
        
        this.paginasDeBestiario.push(this.pagina1);
        this.paginasDeBestiario.push(this.pagina2);
        this.paginasDeBestiario.push(this.pagina3);

        this.paginasDeBestiario.forEach(pagina => this.contenedor.addChild(pagina));
        this.paginasDeBestiario.forEach(pagina => pagina.visible = false);
    }

    async arrancar(){
        await this.precargarAssets();
        
        this.pantallaInicial = new PIXI.Sprite(this.pantallaInicialSprite);
        this.contenedor.addChild(this.pantallaInicial);

        await this.cargarBestiario();
        

        this.app.stage.addChild(this.contenedor);
    }
    
    destruir() {
        this.app.stage.removeChild(this.contenedor);
        this.contenedor.destroy({ children: true });
        console.log("Pantalla de inicio destruida.");
    }
}

const keys = {
    a:false,
    d:false,
    p:false,
    r:false,
    A:false,
    D:false,
    P:false,
    R:false,
    Space:false 
};

const keysProcesadas = {
    p: false,
    P: false
}

const nuevoJuego = new Juego();

const pantallaInicial = new Inicio();

nuevoJuego.arrancar();