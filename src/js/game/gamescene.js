import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("fondo", "public/assets/backgroundbattle.jpeg");
    this.load.image("jugador", "public/assets/sprites/jugador/idle_strip1.png");
  }

  create() {
    this.add.image(400, 300, "fondo");
    this.player = this.physics.add.sprite(100, 450, "jugador");
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);
    const suelo = this.physics.add.staticGroup();
    suelo.create(400, 580, null).setDisplaySize(800, 40).refreshBody();
    this.physics.add.collider(this.player, suelo);
  }
}
