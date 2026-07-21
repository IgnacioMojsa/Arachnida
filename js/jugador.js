class Jugador{
    constructor(x, y, textura){
        this.container = new PIXI.Container();
        this.container.x = x;
        this.container.y = y;
        this.sprite = new PIXI.Sprite(textura);

        this.input = {izq: false, der: false};

        this.velocidad = {x: 0, y: 0}
        this.velMaxima = 80;
        this.aceleracion = 40;
        this.friccion = 0.5;

        this.cooldown = false;
        this.proyectiles = [];

        this.enemigosEliminados = [];

        this.sprite.scale.set(0.05);
        this.sprite.anchor.set(0.5,0);

        this.sombra = new PIXI.Sprite(nuevoJuego.spriteSombraArachnida);
        this.sombra.alpha = 0.6;
        this.sombra.anchor.set(0.5, 0.5);
        this.sombra.zIndex = 4;

        this.reescalar();

        this.container.addChild(this.sprite);
        this.container.zIndex = 5;

        nuevoJuego.mundo.addChild(this.sombra);
    }

    inputTeclado(dt, keys){
        this.input.izq    = keys.a || keys.A;
        this.input.der    = keys.d || keys.D;

        //---- MOVIMIENTO DEL JUGADOR ----//

        let aceleracionX = 0

        if (this.input.izq)    aceleracionX -= this.aceleracion;
        if (this.input.der)    aceleracionX += this.aceleracion;

        this.velocidad.x += aceleracionX * dt;

        if (aceleracionX === 0) this.velocidad.x *= this.friccion;

        this.container.x += this.velocidad.x * dt;

        if (this.velocidad.x > this.velMaxima){
            const limite = this.velMaxima / this.velocidad.x;

            this.velocidad.x *= limite;
        }

        //---- ATAQUE ----//

        const ataque = (keys[" "] && !keysProcesadas[" "]);
        
        if (ataque) {
            this.disparar();
            console.log("Tirando telarañas");
        }
    }

    reescalar(){
        const anchoDiseno = 2100; 
        const altoDiseno = 1080;

        const factorX = window.innerWidth / anchoDiseno;
        const factorY = window.innerHeight / altoDiseno;
        const separacion = window.innerHeight / 10.8;

        this.sprite.scale.x = 0.15 * factorX;
        this.sprite.scale.y = 0.15 * factorY;

        this.sombra.scale.x = 0.16 * factorX;
        this.sombra.scale.y = 0.15 * factorY;
        this.sombra.y = this.container.y + separacion;

        this.container.y = window.innerHeight - 200 * factorY;
    }

    disparar(){
        if(!this.cooldown){
            const nuevoProyectil = new Proyectil(this.container.x, this.container.y, nuevoJuego.spriteTelarania);

            this.proyectiles.push(nuevoProyectil);

            this.cooldown = true;

            setTimeout(() => {this.cooldown = false}, 1000)
        }
    }

    actualizarPosicionProyectiles(){
        if(this.proyectiles.length > 0){
            this.proyectiles.forEach(proyectil => {proyectil.actualizarPosicion()});
        }
    }

    actualizarPosicionSombra(){
        this.sombra.x = this.container.x;
    }

    limpiarProyectiles(){
        const proyectilesFueraDeJuego = this.proyectiles.filter(proyectil => proyectil.container.y < -5);

        proyectilesFueraDeJuego.forEach(proyectil => {proyectil.destruir()});
    }

    mantenerEnPantalla(){
        if(this.container.x > window.innerWidth - 50){
            this.container.x = window.innerWidth - 50;
        }
        else if(this.container.x < 50){
            this.container.x = 50;
        }
    }

    update(dt){
        this.container.x += this.velocidad.x * dt;
        this.actualizarPosicionProyectiles();
        this.limpiarProyectiles();
        this.actualizarPosicionSombra();
        this.mantenerEnPantalla();

        this.reescalar();
    }
}