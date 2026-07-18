class Juego {
    constructor(){
        this.app = null;
        this.mundo = null;
        this.pantallaDeInicio = null;
    }

    async precargarAssets(){
        this.fondoJuego = await PIXI.Assets.load("assets/escenario.png");
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

        this.pantallaDeInicio = new Inicio(this.app);
        await this.pantallaDeInicio.arrancar();
    }

    async empezarPartida(){
        this.mundo = new PIXI.Container();
        this.mundo.sortableChildren = true;
        this.app.stage.addChild(this.mundo);
        
        await this.precargarAssets();
        await this.cargarFondo();
    }

    async cargarFondo(){
        this.fondo = new PIXI.Sprite(this.fondoJuego); 
        this.fondo.zIndex = 0;
        this.mundo.addChild(this.fondo);

        console.log("Fondo cargado")
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
        this.pantallaDeInicioSprite = await PIXI.Assets.load("assets/Inicio1.png");
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
        
        this.pantallaInicial = new PIXI.Sprite(this.pantallaDeInicioSprite);
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

const nuevoJuego = new Juego();
const pantallaInicial = new Inicio();

const keys = {
     w:false,
     a:false,
     s:false,
     d:false,
     e:false,
     t:false,
     W:false,
     A:false,
     S:false,
     D:false,
     E:false,
     T:false,
    Enter:false 
};

window.addEventListener('keydown', (e) => {
  if (e.key in keys){
    keys[e.key] = true;
    e.preventDefault();
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

nuevoJuego.arrancar();