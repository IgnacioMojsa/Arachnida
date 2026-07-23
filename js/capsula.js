class Capsula{
    constructor(x, y, enemigo){
        this.container = new PIXI.Container();
        this.sprite = new PIXI.Sprite(nuevoJuego.spriteOoteca);
        
        this.sprite.anchor.set(0.5, 1);
        
        this.container.x = x;
        this.container.y = y;
        this.container.zIndex = 3;
        
        this.enemigoContenido = enemigo;

        this.reescalarSegunEnemigo();

        this.container.addChild(this.sprite);
        nuevoJuego.mundo.addChild(this.container);
    }

    get collider(){
        return this.sprite.getBounds();
    }

    reescalarSegunEnemigo(){
        this.sprite.scale.set(this.enemigoContenido.tipoEnemigo.escalaContenedor);
    }

    actualizarPosicion(){
        if(this.container.y <= nuevoJuego.jugador.container.y + 90){ 
            this.container.y += 1;
            this.container.zIndex = this.container.y;
        }
    }

    destruir(){
        nuevoJuego.mundo.removeChild(this.container);
        nuevoJuego.nivelActual.ootecasEnNivel.splice(this, 1);
        this.container.destroy({ children: true });
    }
}