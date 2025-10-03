import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    // Fondo
    this.load.image("fondo", "assets/backgroundbattle.jpeg");
    // Sprites del jugador
    this.load.spritesheet("jugador", "assets/sprites/jugador/idle_strip1.png", {
      frameWidth: 144,
      frameHeight: 144
    });
    this.load.spritesheet("jugadorRun", "assets/sprites/jugador/run_strip10.png", {
      frameWidth: 144,
      frameHeight: 144
    });
    this.load.spritesheet("jugadorJump", "assets/sprites/jugador/wait_strip15.png", {
      frameWidth: 144,
      frameHeight: 144
    });

    // Bala
    this.load.image("bala", "assets/sprites/jugador/Boucing_tear.png");
    // corazon
    this.load.image("corazon", "assets/sprites/jugador/heart-removebg-preview.png")
    // sonidos
    this.load.audio("hurt", "assets/soundtrack/jugador-hurt.mp3")
    this.load.audio("dead", "assets/soundtrack/jugador-dead.mp3")
  }

  create() {
    // Fondo
    this.add.image(400, 300, "fondo");

    // Jugador
    this.player = this.physics.add.sprite(100, 450, "jugador");
    this.player.stats = {
      vida: 3,
      fuerza: 350,
      velocidad: 250
    }
    this.player.body.setGravityY(600);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);
    this.corazones = []
    
let xInicial = 20;
let yInicial = 20;
let separacion = 40; // separación entre corazones

for (let i = 0; i < this.player.stats.vida; i++) {
  const corazon = this.add.image(xInicial + i * separacion, yInicial, "corazon").setScrollFactor(0).setScale(0.1);
  this.corazones.push(corazon);
}

    this.sonidoHurt = this.sound.add("hurt");
    this.sonidoDead = this.sound.add("dead");
    // Suelo invisible
    const suelo = this.physics.add.staticGroup();
    const piso = suelo.create(400, 580, null);
    piso.setSize(800, 40);
    piso.setVisible(false);
    this.physics.add.collider(this.player, piso);

    // Controles
    this.teclaHit = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.teclasAtaque = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Grupo de balas
    this.balas = this.physics.add.group({
      defaultKey: "bala",
      maxSize: 10,
      runChildUpdate: true
    });

    // Crear balas inactivas al inicio
    for (let i = 0; i < 10; i++) {
      const bala = this.balas.create(0, 0, "bala");
      bala.setActive(false);
      bala.setVisible(false);
      bala.body.allowGravity = false;

      bala.setScale(2.2);
    }

    // Animaciones
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("jugadorRun", { start: 0, end: 9 }),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("jugador", { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("jugadorJump", { start: 0, end: 14 }),
      frameRate: 20,
      repeat: 1
    });
  }

  disparar(x, y, velX, velY) {
    const bala = this.balas.get(x, y);
    if (bala) {
      bala.setActive(true);
      bala.setVisible(true);
      this.physics.world.enable(bala);
      bala.body.allowGravity = false;
      bala.setVelocity(velX, velY);
    }
  }
  esperarSonido(sonido) {
  return new Promise(resolve => {
    sonido.once('complete', resolve);
    sonido.play();
  });
}
  async perderVida() {
  if (this.player.stats.vida > 0) {
    this.player.stats.vida--;
    const corazon = this.corazones[this.player.stats.vida];
    if (corazon) {
      corazon.setTint(0x808080);
    }
    await this.esperarSonido(this.sonidoHurt);
    if (this.player.stats.vida <= 0) {
      this.sonidoDead.play()
      this.player.setActive(false).setVisible(false);
    }
  }
}
  update() {
    const speed = this.player.stats.velocidad;

    if (Phaser.Input.Keyboard.JustDown(this.teclaHit)) {
  this.perderVida();
}
    // Destruir balas fuera de pantalla
    this.balas.children.iterate((bala) => {
      if (bala.x > 800 || bala.x < 0 || bala.y > 600 || bala.y < 0) {
        bala.setActive(false);
        bala.setVisible(false);
      }
    });

    // Disparo con WASD
    if (Phaser.Input.Keyboard.JustDown(this.teclasAtaque.up)) {
      this.disparar(this.player.x, this.player.y, 0, -500);
    }
    if (Phaser.Input.Keyboard.JustDown(this.teclasAtaque.down)) {
      this.disparar(this.player.x, this.player.y, 0, 500);
    }
    if (Phaser.Input.Keyboard.JustDown(this.teclasAtaque.left)) {
      this.disparar(this.player.x, this.player.y, -500, 0);
    }
    if (Phaser.Input.Keyboard.JustDown(this.teclasAtaque.right)) {
      this.disparar(this.player.x, this.player.y, 500, 0);
    }

    // Animación de salto
    if (!this.player.body.touching.down) {
      this.player.anims.play("jump", true);
    }
    // Movimiento izquierda
    else if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play("walk", true);
      this.player.setFlipX(true);
    }
    // Movimiento derecha
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play("walk", true);
      this.player.setFlipX(false);
    }
    // Quieto
    else {
      this.player.setVelocityX(0);
      this.player.anims.play("idle", true);
    }

    // Salto rápido
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-500);
    }
  }
}
