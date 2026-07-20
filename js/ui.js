async function cargarInterfaz(){
    nuevoJuego.nivelActual = new UINivel(nuevoJuego.spriteNivel1);
}

class UIPuntaje{
    constructor(textura){

    }
}

class UINivel{
    constructor(textura){
        this.contenedor = new PIXI.Container();
        this.spriteNivel = new PIXI.Sprite(textura); 

        this.spriteNivel.anchor.set(1, 0);

        this.contenedor.x = window.innerWidth + 20;
        this.contenedor.y = 20;

        this.contenedor.addChild(this.spriteNivel); 
        nuevoJuego.app.stage.addChild(this.contenedor);
    }
}
