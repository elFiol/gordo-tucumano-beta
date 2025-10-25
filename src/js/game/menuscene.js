export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    this.load.image("fondoMenu", "assets/background-intro.png");
    this.load.audio("musicaMenu", "assets/soundtrack/intro.mp3");
    this.load.audio(
      "peronRisa",
      "assets/soundtrack/peronRisa.mp3"
    );
  }

  create() {
    const fondo = this.add.image(400, 300, "fondoMenu").setOrigin(0.5);
    const titulo = this.add.text(400, 150, "16 de junio de 1955", {
      fontFamily: "Arial Black",
      fontSize: "48px",
      color: "#FFD700",
      stroke: "#000",
      strokeThickness: 8
    }).setOrigin(0.5);

    const texto = this.add.text(400, 400, "Presiona ENTER para comenzar", {
      fontFamily: "Arial",
      fontSize: "34px",
      color: "#000000"
    }).setOrigin(0.5);
    this.musica = this.sound.add("musicaMenu", { loop: true, volume: 0.5 });
    this.peronRisa = this.sound.add("peronRisa", { volume: 0.5 });
    this.musica.play();

    // Evento: presionar ENTER
    this.input.keyboard.once("keydown-ENTER", () => {
      this.musica.stop();
      const negro = this.add.rectangle(400, 300, 800, 600, 0x000000).setAlpha(0);
      this.tweens.add({
        targets: negro,
        alpha: 1,
        duration: 1000,
        onComplete: () => {
          this.peronRisa.play();
          this.time.delayedCall(5000, () => {
            this.scene.start("GameScene");
          });
        }
      });
      fondo.destroy();
      titulo.destroy();
      texto.destroy();
    });
  }
}
