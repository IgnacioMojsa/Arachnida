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
        this.nivelesDelJuego = [];
    }

    async precargarAssets(){
        this.fondoJuego = await PIXI.Assets.load("assets/escenario.png");
        this.aspectoJugador = await PIXI.Assets.load("assets/Arachnida.png");
        this.spriteTelarania = await PIXI.Assets.load("assets/Telarania.png");
        this.spriteNivel1 = await PIXI.Assets.load("assets/Nivel1Visual.png");
        this.spriteNivel2 = await PIXI.Assets.load("assets/Nivel2Visual.png");
        this.spriteMoscaHumedad = await PIXI.Assets.load("assets/MoscaDeHumedad.png");
        this.spriteMariquita = await PIXI.Assets.load("assets/Mariquita.png");
        this.spriteMosca = await PIXI.Assets.load("assets/Mosca.png");
        this.spriteAbeja = await PIXI.Assets.load("assets/Abeja.png");
        this.spriteMosquito = await PIXI.Assets.load("assets/Mosquito.png");
        this.spriteAbejorro = await PIXI.Assets.load("assets/Abejorro.png");
        this.spriteSombraArachnida = await PIXI.Assets.load("assets/sombraArachnida.png");
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
        await this.cargarNiveles();

        this.nivelActual.filtrarEnemigos();
        this.nivelActual.cargarEnemigos();
        this.nivelActual.uiDeNivel.spriteNivel.visible = true

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

    async cargarNiveles(){
        const uiLvl1 = new UINivel(nuevoJuego.spriteNivel1);
        const uiLvl2 = new UINivel(nuevoJuego.spriteNivel2);
        
        const nivel1 = new Nivel(uiLvl1, 10, ["chico"], 1);
        const nivel2 = new Nivel(uiLvl2, 20, ["chico", "mediano"], 2);

        this.nivelesDelJuego.push(nivel1);
        this.nivelesDelJuego.push(nivel2);

        this.nivelActual = nivel1;
    }

    cambiarNivelActual(nuevoNivel){
        if(this.jugador.enemigosEliminados >= this.nivelActual.maxEnemigos - 5){
            this.nivelActual.uiDeNivel.spriteNivel.visible = false;
            this.nivelActual = nuevoNivel;
            this.nivelActual.uiDeNivel.spriteNivel.visible = true;
            this.nivelActual.uiDeNivel.contenedor.x = window.innerWidth + 10;
        }
    }

    chequearColisionDeProyectil(){
        for (let p = this.jugador.proyectiles.length - 1; p >= 0; p--){
            const proyectil = this.jugador.proyectiles[p];

            for (let e = this.nivelActual.enemigosEnNivel.length - 1; e >= 0; e--){
                const enemigo = this.nivelActual.enemigosEnNivel[e];

                if (verificarColision(proyectil.collider, enemigo.collider)){
                    enemigo.health -= 25;

                    proyectil.destruir(p);
                    enemigo.eliminarEnemigo(e);
                    
                    break;
                }
            }
        }
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
        this.jugador.update(dt);

        this.nivelActual.moverEnemigos();
        this.chequearColisionDeProyectil();

        this.cambiarNivelActual(this.nivelesDelJuego.find(lvl => lvl.idDeNivel === 2));
        //actualizarInterfaz();
        //actualizarPuntaje();
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

class Nivel{ 
    constructor(nuevaUI, cantMax, enemigosPermitidos, id){
        this.container = new PIXI.Container();
        this.uiDeNivel = nuevaUI;
        this.idDeNivel = id;

        this.maxEnemigos = cantMax;
        this.enemigosEnNivel = [];
        this.tiposDeEnemigos = enemigosPermitidos;
        this.enemigosDisponibles = [MoscaDeHumedad, Mariquita, Mosca, Abeja, Mosquito, Abejorro];
        this.spawnDeEnemigos = [];
    }

    cargarEnemigos(){  
        let coordenadaY = 0;
        
        for (let i = 0; i < this.maxEnemigos; i++) {
            const coordenadaX = this.posicionAleatoria();
            const enemigoAleatorio = this.enemigosDisponibles[obtenerNumeroAleatorio(0, this.enemigosDisponibles.length - 1)];

            const nuevoEnemigo = new enemigoAleatorio(coordenadaX, coordenadaY);

            this.enemigosEnNivel.push(nuevoEnemigo);
            this.spawnDeEnemigos.push(coordenadaX);

            coordenadaY -= 75;

            nuevoJuego.mundo.addChild(nuevoEnemigo.container);
        }
    }

    filtrarEnemigos(){
        if(this.tiposDeEnemigos.some(e => e === "chico")){
            this.enemigosDisponibles = [MoscaDeHumedad, Mariquita];
        }

        else if(this.tiposDeEnemigos.some(e => e === "mediano")){
            this.enemigosDisponibles = [MoscaDeHumedad, Mariquita, Mosca, Abeja];
        }
    }

    moverEnemigos(){
        if(this.enemigosEnNivel.length > 0){
            this.enemigosEnNivel.forEach(enemigo => enemigo.moverse())
        }
    }

    posicionAleatoria(){
        const posicion = obtenerNumeroAleatorio(0, window.innerWidth - 70);
        
        if(this.spawnDeEnemigos.length === 0 || !this.spawnDeEnemigos.some(p => p === posicion)){
            return posicion;
        }
        
        return obtenerNumeroAleatorio(0, window.innerWidth - 70);
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