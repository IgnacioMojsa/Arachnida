class Juego {
    constructor(){
        this.app = null;
        this.mundo = null;
        this.pantallaInicial = null;
        this.jugador = null;
        this.nuevoAhora = performance.now();

        this.juegoEnCurso = false;
        this.bestiarioAbierto = false;

        this.maxProyectiles = 20;

        this.nivelActual = null;
    }

    async precargarAssets(){
        this.fondoJuego = await PIXI.Assets.load("assets/escenario.png");
        this.aspectoJugador = await PIXI.Assets.load("assets/Arachnida.png");
        this.spriteTelarania = await PIXI.Assets.load("assets/Telarania.png");
        this.spriteNivel1 = await PIXI.Assets.load("assets/Nivel1Visual.png");
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

        this.app.renderer.on('resize', () => this.ajustarPantalla());
        
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
        await cargarInterfaz();

        this.juegoEnCurso = true;

        this.app.ticker.add(() => this.gameLoop());
    }

    async cargarFondo(){
        this.fondo = new PIXI.Sprite(this.fondoJuego); 
        this.fondo.zIndex = 0;
        this.fondo.width = window.innerWidth;
        this.fondo.height = window.innerHeight;

        this.mundo.addChild(this.fondo);

        console.log("Fondo cargado")
    }

    async cargarJugador(){
        this.jugador = new Jugador(window.innerWidth/2, window.innerHeight - 200, this.aspectoJugador);
        this.mundo.addChild(this.jugador.container);
    }

    configurarTeclado(){
        window.addEventListener('wheel', (event) => {
            if (event.ctrlKey) {
                event.preventDefault();
            }
        }, { passive: false });
        
        window.addEventListener('keydown', (e) => {
            if (e.key in keys){
                keys[e.key] = true;
                e.preventDefault();
            }

            if ((e.key === "p" || e.key === "P") && this.pantallaInicial && !this.mundo) {
                this.empezarPartida();
            }

            if ((e.key === "b" || e.key === "B") && this.pantallaInicial && !this.mundo && !this.bestiarioAbierto) {
                this.pantallaInicial.abrirBestiario();
                this.bestiarioAbierto = true;  
            }
            else if ((e.key === "b" || e.key === "B") && this.pantallaInicial && !this.mundo && this.bestiarioAbierto) {
                this.pantallaInicial.cerrarBestiario();  
                this.bestiarioAbierto = false;  
            }
        });

        window.addEventListener('keyup', (e) => {
        // Si la tecla existe en keys, la marcamos como false
        if (e.key in keys){
                keys[e.key] = false;
                keysProcesadas[e.key] = false; // <-- AGREGA ESTO: permite volver a disparar
                e.preventDefault();
            } 
        });

        window.inputKeys = window.inputKeys || {};
        window.addEventListener('keydown', (e) => { window.inputKeys[e.key.toLowerCase()] = true; });
        window.addEventListener('keyup',   (e) => { window.inputKeys[e.key.toLowerCase()] = false; });
    }

    ajustarPantalla(){
        if (this.juegoEnCurso) {
            this.fondo.width = window.innerWidth;
            this.fondo.height = window.innerHeight;
        }

        if (!this.juegoEnCurso) {
            this.pantallaInicial.imagenDeInicio.width = window.innerWidth;
            this.pantallaInicial.imagenDeInicio.height = window.innerHeight;
        }

        if(this.bestiarioAbierto){
            this.pantallaInicial.paginaActualBestiario.width = window.innerWidth;
            this.pantallaInicial.paginaActualBestiario.height = window.innerHeight;
        }
    }

    gameLoop() {
        const ahora = performance.now();
        if(!this.nuevoAhora) this.nuevoAhora = ahora;
        
        const dt = Math.min(0.05, (ahora - this.nuevoAhora) / 1000);
        if (isNaN(dt) || dt > 0.1) dt = 1/60;
        this.nuevoAhora = ahora;
        
        this.ajustarPantalla();
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
        this.imagenDeInicio = null;
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

        this.paginaActualBestiario = this.paginasDeBestiario[0];
    }

    async arrancar(){
        await this.precargarAssets();
        
        this.imagenDeInicio = new PIXI.Sprite(this.pantallaInicialSprite);
        this.imagenDeInicio.width = window.innerWidth;
        this.imagenDeInicio.height = window.innerHeight;
        this.contenedor.addChild(this.imagenDeInicio);

        await this.cargarBestiario();

        this.app.stage.addChild(this.contenedor);
    }

    abrirBestiario(){
        this.paginaActualBestiario.visible = true;
        this.paginaActualBestiario.width = window.innerWidth;
        this.paginaActualBestiario.height = window.innerHeight;
    }

    cerrarBestiario(){
        this.paginaActualBestiario.visible = false;
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
    " ":false 
};

const keysProcesadas = {
    p: false,
    P: false,
    " ":false 
}

function unaTeclaFuePresionada(key){
    if (keys[key] && !keysProcesadas[key]){
        keysProcesadas[key] = true;
        return true;
    }
    else{
        return false;
    }
}

const nuevoJuego = new Juego();

const pantallaInicial = new Inicio();

nuevoJuego.arrancar();