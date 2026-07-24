const chico = {recarga: 1, escalaContenedor:0.07};
const mediano = {recarga: 2, escalaContenedor: 0.09};
const grande = {recarga: 3, escalaContenedor: 2};

class Enemigo{
    constructor(x, y, textura, textura2){
        this.container = new PIXI.Container();
        this.sprite = new PIXI.Sprite(textura);
        this.spriteDolor = new PIXI.Sprite(textura2);
        this.container.x = x;
        this.container.y = y - 15;
        this.container.zIndex = this.container.y;

        this.health = null;
        this.tipoEnemigo = null;

        this.spriteDolor.visible = false;

        this.container.addChild(this.sprite);
        this.container.addChild(this.spriteDolor);
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
            this.spriteDolor.visible = true;
            this.sprite.visible = false;

            setTimeout(() => {
                const nuevaOoteca = new Capsula(this.container.x, this.container.y, this);

                nuevoJuego.nivelActual.ootecasEnNivel.push(nuevaOoteca);

                nuevoJuego.mundo.removeChild(this.container);
                nuevoJuego.nivelActual.enemigosEnNivel.splice(indice, 1);
                this.container.destroy({ children: true });
                nuevoJuego.jugador.enemigosEliminados += 1;
                console.log("Enemigo eliminado.");
            }, 250);
        }
    } 

    recibirImpacto(){
        this.health -= 25;
        this.spriteDolor.visible = true;
        this.sprite.visible = false;

        setTimeout(() => {
            this.spriteDolor.visible = false;
            this.sprite.visible = true;
        }, 250);
    }
}

class MoscaDeHumedad extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteMoscaHumedad, nuevoJuego.spriteMoscaHumedadDañada);

        this.sprite.scale.x = 0.05 * window.innerWidth / 1060;
        this.sprite.scale.y = 0.05 * window.innerHeight / 609;

        this.spriteDolor.scale.x = 0.05 * window.innerWidth / 1060;
        this.spriteDolor.scale.y = 0.05 * window.innerHeight / 609;

        this.health = 25; 
        this.tipoEnemigo = chico;
    }
}

class Mariquita extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteMariquita, nuevoJuego.spriteMariquitaDañada);

        this.sprite.scale.x = 0.07 * window.innerWidth / 1074;
        this.sprite.scale.y = 0.07 * window.innerHeight / 622;

        this.spriteDolor.scale.x = 0.07 * window.innerWidth / 1074;
        this.spriteDolor.scale.y = 0.07 * window.innerHeight / 622;

        this.health = 50;
        this.tipoEnemigo = chico;
    }
}

class Mosca extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteMosca, nuevoJuego.spriteMoscaDañada);

        this.sprite.scale.x = 0.08 * (window.innerWidth / 1073);
        this.sprite.scale.y = 0.09 * (window.innerHeight / 754);

        this.spriteDolor.scale.x = 0.08 * window.innerWidth / 1073;
        this.spriteDolor.scale.y = 0.09 * window.innerHeight / 754;

        this.health = 75;
        this.tipoEnemigo = mediano;
    }
}

class Abeja extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteAbeja, nuevoJuego.spriteAbejaDañada);

        this.sprite.scale.x = 0.098 * (window.innerWidth / 1030);
        this.sprite.scale.y = 0.14 * (window.innerHeight / 962);

        this.spriteDolor.scale.x = 0.095 * (window.innerWidth / 1030);
        this.spriteDolor.scale.y = 0.14 * (window.innerHeight / 962);

        this.health = 100;
        this.tipoEnemigo = mediano;
    }
}

class Mosquito extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteMosquito);

        this.sprite.scale.x = 0.14 * (window.innerWidth / 1044);
        this.sprite.scale.y = 0.18 * (window.innerHeight / 893);

        this.health = 150; 
        this.tipoEnemigo = grande;
    }
}

class Abejorro extends Enemigo{
    constructor(x, y){
        super(x, y, nuevoJuego.spriteAbejorro);

        this.sprite.scale.x = 0.15 * (window.innerWidth / 1074);
        this.sprite.scale.y = 0.21 * (window.innerHeight / 844);

        this.health = 175;
        this.tipoEnemigo = grande;
    }
}