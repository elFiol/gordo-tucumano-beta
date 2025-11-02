export default class LoseScene extends Phaser.Scene {
  constructor() {
    super("LoseScene");
  }

  preload() {
    this.load.image("fondoDerrota", "/assets/lose.jpg");
  }

  create() {
    const fondo = this.add.image(0, 0, "fondoDerrota").setOrigin(0);
    const { width, height } = this.sys.game.canvas;
    fondo.displayWidth = width;
    fondo.displayHeight = height;
    // Texto de derrota
    this.add.text(width / 2, height / 4, "¡fuiste derrotado!", {
      fontFamily: "Georgia, Times, serif",
      fontStyle: "italic",
      fontSize: "64px",
      color: "#e62344ff",
      stroke: "#000",
      strokeThickness: 8
    }).setOrigin(0.5);

    this.add.text(width / 2, height - 80, "Presiona ENTER para volver a intentar", {
      fontFamily: "Georgia, Times, serif",
      fontStyle: "italic",
      fontSize: "24px",
      color: "#000000"
    }).setOrigin(0.5);

    this.input.keyboard.once("keydown-ENTER", () => {
      this.scene.start("MenuScene");
    });
  }
}
