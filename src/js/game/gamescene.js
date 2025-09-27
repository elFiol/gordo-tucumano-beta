import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("fondo", "assets/backgroundbattle.jpeg");
    this.load.image("jugador", "assets/sprites/jugador/idle_strip1.png");
  }

  create() {
    this.add.image(400, 300, "fondo");
    this.player = this.physics.add.sprite(100, 450, "jugador");
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);
    const suelo = this.physics.add.staticGroup();
 const piso = suelo.create(400, 580, null);
piso.setSize(800, 40);
piso.setVisible(false); 
this.physics.add.collider(this.player, piso);
    this.physics.add.collider(this.player, suelo);
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    // Movimiento simple para probar
    if (!this.cursors) return;

    const speed = 300;
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-250);
    }
  }
}