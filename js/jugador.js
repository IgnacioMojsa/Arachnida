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

        this.sprite.scale.set(0.35);
        this.sprite.anchor.set(0.5,0);

        this.container.addChild(this.sprite);
        this.container.zIndex = 5;
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

        this.sprite.scale.x = 0.35 * factorX;
        this.sprite.scale.y = 0.35 * factorY;

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

    limpiarProyectiles(){
        const proyectilesFueraDeJuego = this.proyectiles.filter(proyectil => proyectil.container.y < -5);

        proyectilesFueraDeJuego.forEach(proyectil => {proyectil.destruir()});
    }

    mantenerEnPantalla(){

    }

    update(dt){
        this.container.x += this.velocidad.x * dt;
        this.actualizarPosicionProyectiles();
        this.limpiarProyectiles();

        this.reescalar();
    }
}