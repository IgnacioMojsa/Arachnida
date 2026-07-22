async function cargarInterfaz(){
    nuevoJuego.uiDeProyectiles = new UIProyectiles(nuevoJuego.spritesDeProyectiles);

    nuevoJuego.uiDeProyectiles.container.x = 110;
    nuevoJuego.uiDeProyectiles.container.y = window.innerHeight - 5;
    nuevoJuego.uiDeProyectiles.actualizarCargas();

    nuevoJuego.uiControles = new PIXI.Sprite(nuevoJuego.spriteControles);
    nuevoJuego.uiControles.anchor.set(0.5);
    nuevoJuego.uiControles.x = window.innerWidth / 2;
    nuevoJuego.uiControles.y = window.innerHeight / 4;

    nuevoJuego.app.stage.addChild(nuevoJuego.uiDeProyectiles.container);
    nuevoJuego.app.stage.addChild(nuevoJuego.uiControles);
}

class UIProyectiles{
    constructor(textura){
        this.container = new PIXI.Container();

        this.cargarSprites(textura);
    }

    cargarSprites(spritesACargar){
        this.spritesAnimados = {};

        for (let key of Object.keys(spritesACargar.animations)) {
            this.spritesAnimados[key] = new PIXI.AnimatedSprite(spritesACargar.animations[key])
      
            this.spritesAnimados[key].name = key;
            this.spritesAnimados[key].play();
            this.spritesAnimados[key].loop = true;
            this.spritesAnimados[key].animationSpeed = 0.15;
            this.spritesAnimados[key].anchor.set(0.5, 1);
            this.container.addChild(this.spritesAnimados[key]);
        }
    }

    cambiarAnimacion(nuevaAnimacion){
        this.animacionActual = nuevaAnimacion;

        for (let key of Object.keys(this.spritesAnimados)) {
            this.spritesAnimados[key].visible = false;
        }

        this.spritesAnimados[nuevaAnimacion].visible = true;
        this.spriteAnimadoActual = this.spritesAnimados[nuevaAnimacion];
    }

    actualizarCargas(){
        const cargasActuales = nuevoJuego.jugador.cargasDisponibles.toString();

        this.cambiarAnimacion(cargasActuales);
    }
}

class UINivel{
    constructor(textura){
        this.contenedor = new PIXI.Container();
        this.spriteNivel = new PIXI.Sprite(textura); 

        this.spriteNivel.anchor.set(1, 1);

        this.contenedor.x = window.innerWidth + 20;
        this.contenedor.y = window.innerHeight;

        this.spriteNivel.visible = false;

        this.contenedor.addChild(this.spriteNivel); 
        nuevoJuego.app.stage.addChild(this.contenedor);
    }
}
