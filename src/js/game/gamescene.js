import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    // Fondo
    this.load.image("fondo", "assets/backgroundbattle.jpeg");

    // Sprite de idle
    this.load.spritesheet("jugador", "assets/sprites/jugador/idle_strip1.png", {
      frameWidth: 144,
      frameHeight: 144
    });
    // Sprite de correr
    this.load.spritesheet("jugadorRun", "assets/sprites/jugador/run_strip10.png", {
      frameWidth: 144,
      frameHeight: 144
    });
    // sprite de saltar
    this.load.spritesheet("jugadorJump", "assets/sprites/jugador/wait_strip15.png", {
      frameWidth: 144,
      frameHeight: 144
    });
  }

  create() {
    // Fondo
    this.add.image(400, 300, "fondo");

    // Jugador
    this.player = this.physics.add.sprite(100, 450, "jugador");
    this.player.body.setGravityY(600)
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);
    // Origen en la base del sprite (pies tocando el suelo)
    this.player.setOrigin(0.5, 1);

    // Suelo invisible
    const suelo = this.physics.add.staticGroup();
    const piso = suelo.create(400, 580, null);
    piso.setSize(800, 40);
    piso.setVisible(false);

    // Colisión jugador-suelo
    this.physics.add.collider(this.player, piso);

    // Controles
    this.cursors = this.input.keyboard.createCursorKeys();

    // Animación de caminar
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("jugadorRun", { start: 0, end: 9 }),
      frameRate: 15,
      repeat: -1
    });

    // animacion de parado

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("jugador", { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1
    });

    // animacion de saltar

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("jugadorJump", { start: 0, end: 14 }),
      frameRate: 20,
      repeat: 1
    });
  }

  update() {
    if (!this.cursors) return;

    const speed = 200;
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
      this.player.anims.stop();
      this.player.anims.play("idle",true); // frame idle
    }

    // Salto
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-500);
    }
  }
}
