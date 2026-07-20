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

    get collider() {
        return this.sprite.getBounds();
    }

    actualizarPosicion(){
        this.container.y -= 1;
        this.container.zIndex = this.container.y;
    }

    destruir(indice){
        //Pasado el limite de la pantalla (mas algunos pixeles), se debe eliminar la instancia de proyectil
        nuevoJuego.mundo.removeChild(this.container);
        nuevoJuego.jugador.proyectiles.splice(indice, 1);
        this.container.destroy({ children: true });
        console.log("Instancia de proyectil destruida.");
    }
}