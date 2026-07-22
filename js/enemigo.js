const chico = {recarga: 1, escalaContenedor:0.5};
const mediano = {recarga: 2, escalaContenedor: 1};
const grande = {recarga: 3, escalaContenedor: 2};

class Enemigo{
    constructor(x, y, textura){
        this.container = new PIXI.Container();
        this.sprite = new PIXI.Sprite(textura);
        this.container.x = x;
        this.container.y = y - 15;
        this.container.zIndex = this.container.y;

        this.health = null;
        this.tipoEnemigo = null;

        this.container.addChild(this.sprite);
    }

    get collider() {
        return this.sprite.getBounds();
    }

    moverse(){
        this.container.y += 0.15;
        this.container.zIndex = this.container.y;
    }

    eliminarEnemigo(indice){
        if(this.health <= 0){
            const nuevaOoteca = new Capsula(this.container.x, this.container.y, this);

            nuevoJuego.nivelActual.ootecasEnNivel.push(nuevaOoteca);
            
            nuevoJuego.mundo.removeChild(this.container);
            nuevoJuego.nivelActual.enemigosEnNivel.splice(indice, 1);
            this.container.destroy({ children: true });
            nuevoJuego.jugador.enemigosEliminados += 1;
            console.log("Enemigo eliminado.");
        }
    } 
}

class MoscaDeHumedad extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteMoscaHumedad);

        this.sprite.scale.x = 0.05 * window.innerWidth / 1060;
        this.sprite.scale.y = 0.05 * window.innerHeight / 609;

        this.health = 25; 
        this.tipoEnemigo = chico;
    }
}

class Mariquita extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteMariquita);

        this.sprite.scale.x = 0.07 * window.innerWidth / 1074;
        this.sprite.scale.y = 0.07 * window.innerHeight / 622;

        this.health = 50;
        this.tipoEnemigo = chico;
    }
}

class Mosca extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteMosca);

        this.health = 75;
        this.tipoEnemigo = mediano;
    }
}

class Abeja extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteAbeja);

        this.health = 100;
        this.tipoEnemigo = mediano;
    }
}

class Mosquito extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteMosquito);

        this.health = 150; 
        this.tipoEnemigo = grande;
    }
}

class Abejorro extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteAbejorro);

        this.health = 175;
        this.tipoEnemigo = grande;
    }
}