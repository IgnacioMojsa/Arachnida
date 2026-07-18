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

        this.sprite.scale.set(0.35);

        this.container.addChild(this.sprite);
        this.container.zIndex = 5;
    }

    inputTeclado(dt, keys){
        this.input.izq    = keys.a || keys.A;
        this.input.der    = keys.d || keys.D;

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
    }

    mantenerEnPantalla(){

    }

    update(dt){
        this.container.x += this.velocidad.x * dt;
    }
}