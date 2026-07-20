class Enemigo{
    constructor(x, y, textura){
        this.container = new PIXI.Container();
        this.sprite = new PIXI.Sprite(textura);
        this.container.x = x;
        this.container.y = y - 15;

        this.health = null;
        this.tipoEnemigo = null;

        this.container.addChild(this.sprite);
    }
}

class MoscaDeHumedad extends Enemigo{
    constructor(x, y){
        super(x, y, PIXI.Assets.load("assets/MoscaDeHumedad.png"));

        this.health = 25; 
        this.tipoEnemigo = "chico";
    }
}

class Mariquita extends Enemigo{
    constructor(x, y){
        super(x, y, PIXI.Assets.load("assets/Mariquita.png"));

        this.health = 50;
        this.tipoEnemigo = "chico";
    }
}

class Mosca extends Enemigo{
    constructor(x, y){
        super(x, y, PIXI.Assets.load("assets/Mosca.png"));

        this.health = 75;
        this.tipoEnemigo = "mediano";
    }
}

class Abeja extends Enemigo{
    constructor(x, y){
        super(x, y, PIXI.Assets.load("assets/Abeja.png"));

        this.health = 100;
        this.tipoEnemigo = "mediano";
    }
}

class Mosquito extends Enemigo{
    constructor(x, y){
        super(x, y, PIXI.Assets.load("assets/Mosquito.png"));

        this.health = 150; 
        this.tipoEnemigo = "grande";
    }
}

class Abejorro extends Enemigo{
    constructor(x, y){
        super(x, y, PIXI.Assets.load("assets/Abejorro.png"));

        this.health = 175;
        this.tipoEnemigo = "grande";
    }
}