class Proyectil{
    constructor(x, y, textura){
        this.sprite = new PIXI.Sprite(textura);
        this.container = new PIXI.Container();
        this.container.x = x;
        this.container.y = y;

        this.sprite.scale.set(0.5);
        this.sprite.anchor.set(0.5,0);

        this.container.addChild(this.sprite);
        nuevoJuego.mundo.addChild(this.container);
    }

    actualizarPosicion(){
        this.container.y -= 1;
        this.container.zIndex = this.container.y;
    }

    destruir(){
        //Pasado el limite de la pantalla (mas algunos pixeles), se debe eliminar la instancia de proyectil
    }
}