class UIPuntaje{
    constructor(textura){

    }
}

class UINivel{
    constructor(textura){
        this.contenedor = new PIXI.Container();
        this.spriteNivel = new PIXI.Sprite(textura); 

        this.spriteNivel.anchor.set(1, 1);

        this.contenedor.x = window.innerWidth + 40;
        this.contenedor.y = window.innerHeight;

        this.contenedor.addChild(this.spriteNivel); 
        nuevoJuego.app.stage.addChild(this.contenedor);
    }
}
