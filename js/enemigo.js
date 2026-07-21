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
            nuevoJuego.mundo.removeChild(this.container);
            nuevoJuego.nivelActual.enemigosEnNivel.splice(indice, 1);
            this.container.destroy({ children: true });
            console.log("Enemigo eliminado.");
        }
    } 
}

class MoscaDeHumedad extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteMoscaHumedad);

        this.health = 25; 
        this.tipoEnemigo = "chico";
    }
}

class Mariquita extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteMariquita);

        this.health = 50;
        this.tipoEnemigo = "chico";
    }
}

class Mosca extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteMosca);

        this.health = 75;
        this.tipoEnemigo = "mediano";
    }
}

class Abeja extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteAbeja);

        this.health = 100;
        this.tipoEnemigo = "mediano";
    }
}

class Mosquito extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteMosquito);

        this.health = 150; 
        this.tipoEnemigo = "grande";
    }
}

class Abejorro extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteAbejorro);

        this.health = 175;
        this.tipoEnemigo = "grande";
    }
}