export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super("VictoryScene");
  }

  preload() {
    // Fondo
    this.load.image("fondoVictoria", "/assets/victory.jpg");

    // Sprite del jugador bailando
    this.load.spritesheet("jugadorBaile", "/assets/sprites/jugador/isaac.png", {
      frameWidth: 56,
      frameHeight: 47
    });
    this.load.audio("musicaVictoria", "/assets/soundtrack/specialist-dance-p4-made-with-Voicemod.mp3");
  }

  create() {
    const fondo = this.add.image(0, 0, "fondoVictoria").setOrigin(0);
    const { width, height } = this.sys.game.canvas;
    fondo.displayWidth = width;
    fondo.displayHeight = height;
    this.musicaVictoria = this.sound.add("musicaVictoria", { loop: true, volume: 0.6 })
    this.musicaVictoria.play()

    // Animación de baile
    this.anims.create({
      key: "baile",
      frames: this.anims.generateFrameNumbers("jugadorBaile", { start: 0, end: 449 }),
      frameRate: 35,
      repeat: -1
    });

    const jugador = this.add.sprite(400, 350, "jugadorBaile").setScale(3);
    jugador.play("baile");

    // Texto de victoria
    this.add.text(width / 2, height / 4, "¡VICTORIA!", {
      fontFamily: "Arial Black",
      fontSize: "64px",
      color: "#FFD700",
      stroke: "#000",
      strokeThickness: 8
    }).setOrigin(0.5);
    
    this.add.text(width / 2, height - 190, "Gracias por jugar", {
      fontFamily: "Georgia, Times, serif",
      fontStyle: "italic",
      fontSize: "34px",
      color: "#e9c111ff",
      stroke: "#000",
      strokeThickness: 8
    }).setOrigin(0.5);

    this.add.text(width / 2, height - 150, "Atentamente 5to 2da", {
      fontFamily: "Georgia, Times, serif",
      fontStyle: "italic",
      fontSize: "34px",
      color: "#e9c111ff",
      stroke: "#000",
      strokeThickness: 8
    }).setOrigin(0.5);

    this.add.text(width / 2, height - 80, "Presiona ENTER para volver al menú", {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#FFFFFF"
    }).setOrigin(0.5);

    // Reiniciar al presionar ENTER
    this.input.keyboard.once("keydown-ENTER", () => {
      this.musicaVictoria.stop();
      this.scene.start("MenuScene");
    });
  }
}
