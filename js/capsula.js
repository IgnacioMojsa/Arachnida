class Capsula{
    constructor(x, y, enemigo){
        this.container = new PIXI.Container();
        this.sprite = new PIXI.Sprite(nuevoJuego.spriteOoteca);
        
        this.sprite.anchor.set(0);
        
        this.container.x = x;
        this.container.y = y;
        this.container.zIndex = 3;
        
        this.enemigoContenido = enemigo;

        this.reescalarSegunEnemigo();

        this.container.addChild(this.sprite);
        nuevoJuego.mundo.addChild(this.container);
    }

    reescalarSegunEnemigo(){
        this.sprite.scale.set(this.enemigoContenido.tipoEnemigo.escalaContenedor);
    }

    actualizarPosicion(){
        if(this.container.y <= nuevoJuego.jugador.container.y + 50){ 
            this.container.y += 1;
            this.container.zIndex = this.container.y;
        }
    }
}