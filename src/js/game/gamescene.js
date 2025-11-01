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
    this.load.spritesheet("jugadorHurts", "assets/sprites/jugador/ledge_strip20.png" , {
      frameWidth: 144,
      frameHeight: 144
    })
    // Bala
    this.load.image("bala", "assets/sprites/jugador/Boucing_tear.png");
    // corazon
    this.load.image("corazon", "assets/sprites/jugador/heart-removebg-preview.png")
    // sonidos
    this.load.audio("hurt", "assets/soundtrack/jugador-hurt.mp3")
    this.load.audio("dead", "assets/soundtrack/jugador-dead.mp3")
    this.load.audio("peronDisparo", "assets/soundtrack/monstro-pounce-made-with-Voicemod.mp3")
    this.load.audio("peronDead", "assets/soundtrack/the-binding-of-isaac-rebirth-satan-sfx-made-with-Voicemod.mp3")
    // jefes
    this.load.image("peronSerio", "assets/sprites/jefe/peronserioSinReco-removebg-preview.png")
    this.load.image("peronLaught", "assets/sprites/jefe/peronlaughtSinReco-removebg-preview.png")
    this.load.image("peronScared", "assets/sprites/jefe/peronScaredSinReco-removebg-preview.png")
  }

  create() {
    // Fondo
    this.add.image(400, 300, "fondo");

    // Jefe
    this.boss1 = this.physics.add.sprite(600, 200, "peronSerio")
      .setCollideWorldBounds(true)
      .setImmovable(true)
      .setScale(1.2)
      .setBounce(1, 0);
    this.boss1.stats = { vida: 1000, maxVida: 1000, velocidad: 300, activo: true, direccion: 1, patronActual: 1};
    this.boss1.body.allowGravity = false;
    this.boss1.setSize(120, 120).setOffset(10, 10);
    this.boss1.body.enable = true;
    this.ultimoDisparoBoss = 0
    this.boss1.lifeBarBg = this.add.rectangle(
  this.boss1.x, this.boss1.y - 100, // posición sobre el jefe
  300, 20,                          // ancho y alto
  0x000000                          // color de fondo (negro)
).setOrigin(0.5).setScrollFactor(0);

this.boss1.lifeBar = this.add.rectangle(
  this.boss1.x, this.boss1.y - 100,
  300, 20,
  0xff0000                          // color de la vida (rojo)
).setOrigin(0.5).setScrollFactor(0);
    this.boss1.body.updateFromGameObject();
    this.boss1.body.debugShowBody = true;
    this.boss1.body.debugBodyColor = 0x00ff00;
    // Jugador
    this.player = this.physics.add.sprite(100, 450, "jugador");
    this.player.stats = { vida: 3, fuerza: 8, velocidad: 250, activo: true };
    this.player.body.setGravityY(600);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);
    this.player.setSize(8, 8);
    this.puedeDisparar = true;
    this.cadencia = 1000;
    // Corazones
    this.corazones = [];
    let xInicial = 20, yInicial = 20, separacion = 40;
    for (let i = 0; i < this.player.stats.vida; i++) {
      const corazon = this.add.image(xInicial + i * separacion, yInicial, "corazon")
        .setScrollFactor(0)
        .setScale(0.1);
      this.corazones.push(corazon);
    }

    // Sonidos
    this.sonidoPeronDead = this.sound.add("peronDead");
    this.sonidoPeronDisparo = this.sound.add("peronDisparo");
    this.sonidoHurt = this.sound.add("hurt");
    this.sonidoDead = this.sound.add("dead");

    // Suelo invisible
    const suelo = this.physics.add.staticGroup();
    const piso = suelo.create(400, 580, null).setSize(800, 40).setVisible(false);
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

    // Grupo de balas jugador
    this.balas = this.physics.add.group({ maxSize: 30 });
    for (let i = 0; i < 30; i++) {
      const bala = this.balas.create(0, 0, "bala");
      bala.setActive(false).setVisible(false);
      bala.body.allowGravity = false;
      bala.setScale(2.2);
      bala.body.setSize(20, 20);
    }

    // Grupo de balas jefe
    this.balasBoss = this.physics.add.group({ maxSize: 10 });
    for (let i = 0; i < 10; i++) {
      const bala = this.balasBoss.create(0, 0, "bala");
      bala.setActive(false).setVisible(false);
      bala.body.allowGravity = false;
      bala.setScale(3);
      bala.body.setSize(10, 10);
    }

    // Overlaps
    this.physics.add.overlap(this.player, this.balasBoss, (player, bala) => {
      bala.setActive(false).setVisible(false);
      this.perderVida();
    });

    this.physics.add.overlap(this.balas, this.boss1, function(bala, boss) {
    if(this.boss1.stats.activo){
    this.balas.setActive(false).setVisible(false);
    this.boss1.stats.vida -= 3;
    const vidaPercent = Phaser.Math.Clamp(this.boss1.stats.vida / this.boss1.stats.maxVida, 0, 1);
    this.boss1.lifeBar.width = 300 * vidaPercent;
    this.boss1.lifeBar.x = this.boss1.x;
    this.boss1.lifeBarBg.x = this.boss1.x;

    this.boss1.setTint(0xff0000);
    this.time.delayedCall(200, () => this.boss1.clearTint());

    if (this.boss1.stats.vida <= 0) {
      this.boss1.lifeBar.setVisible(false);
      this.boss1.lifeBarBg.setVisible(false);
      this.boss1.stats.activo = false
      this.sound.play("peronDead");
      this.boss1.setTexture("peronScared").setScale(2);
      this.time.delayedCall(0, () => {
  this.tweens.add({
    targets: this.boss1,
    x: this.boss1.x + 5,   // mueve 5px a la derecha
    yoyo: true,
    repeat: 50,             // 50 repeticiones → dura aprox 5 segundos
    duration: 50,           // velocidad de cada movimiento
    onYoyo: () => {},       // opcional, se ejecuta cada yoyo
  });
});

      this.time.delayedCall(5000, () => {
        this.boss1.setActive(false).setVisible(false)
        this.scene.start("VictoryScene");
    })
    }}
}, null, this);
    // Animaciones
    this.anims.create({ key: "hurts", frames: this.anims.generateFrameNumbers("jugadorHurts", { start: 0, end: 19 }), frameRate: 35 });
    this.anims.create({ key: "walk", frames: this.anims.generateFrameNumbers("jugadorRun", { start: 0, end: 9 }), frameRate: 15, repeat: -1 });
    this.anims.create({ key: "idle", frames: this.anims.generateFrameNumbers("jugador", { start: 0, end: 0 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "jump", frames: this.anims.generateFrameNumbers("jugadorJump", { start: 0, end: 14 }), frameRate: 20, repeat: 1 });

  }

  disparoDirecto() {
    if (this.boss1.stats.activo){
    this.boss1.setTexture("peronLaught").setScale(1.5);
    this.sonidoPeronDisparo.play();

    const bala = this.balasBoss.get(this.boss1.x, this.boss1.y);
    if (!bala) return;
    bala.setActive(true).setVisible(true).setVelocity(0, 0);

    const angulo = Phaser.Math.Angle.Between(this.boss1.x, this.boss1.y, this.player.x, this.player.y);
    const velocidad = 500;
    bala.setVelocity(Math.cos(angulo) * velocidad, Math.sin(angulo) * velocidad);

    this.time.delayedCall(500, () => {
      if (this.boss1.stats.activo) {
        this.boss1.setTexture("peronSerio").setScale(1);
      }
    });
  }}

  disparoRafaga() {
  this.boss1.setTexture("peronLaught").setScale(1.5);
  this.sonidoPeronDisparo.play();

  for (let i = -1; i <= 1; i++) {
    const bala = this.balasBoss.get(this.boss1.x, this.boss1.y);
    if (!bala) continue;
    bala.setActive(true).setVisible(true);

    const anguloBase = Phaser.Math.Angle.Between(this.boss1.x, this.boss1.y, this.player.x, this.player.y);
    const angulo = anguloBase + Phaser.Math.DegToRad(i * 15); // abre abanico 15° por bala
    const velocidad = 400;
    bala.setVelocity(Math.cos(angulo) * velocidad, Math.sin(angulo) * velocidad);
  }

  this.time.delayedCall(600, () => this.boss1.setTexture("peronSerio").setScale(1));
}

disparoCircular() {
  const cantidad = 16;
  const velocidad = 400;
  this.boss1.setTexture("peronLaught").setScale(1.5);
  this.sonidoPeronDisparo.play();

  for (let i = 0; i < cantidad; i++) {
    const angulo = (i / cantidad) * Math.PI * 2;
    const bala = this.balasBoss.get(this.boss1.x, this.boss1.y);
    if (!bala) continue;
    bala.setActive(true).setVisible(true);
    bala.setVelocity(Math.cos(angulo) * velocidad, Math.sin(angulo) * velocidad);
  }
  this.time.delayedCall(500, () => {
      if (this.boss1.stats.activo) {
        this.boss1.setTexture("peronSerio").setScale(1);
      }
  });
}

  disparar(x, y, velX, velY) {
     if (!this.puedeDisparar) return; // si está en cooldown, no dispara

  const bala = this.balas.get(x, y);
  if (!bala) return;

  bala.setActive(true).setVisible(true).setVelocity(velX, velY);

  this.puedeDisparar = false;

  this.time.addEvent({
    delay: this.cadencia,
    callback: () => (this.puedeDisparar = true),
    callbackScope: this,
  });
  }

  esperarSonido(sonido) {
    return new Promise(resolve => {
      sonido.once('complete', resolve);
      sonido.play();
    });
  }

  async perderVida() {
    if (this.player.stats.vida > 0 && !this.player.estaHerido) {
      this.player.estaHerido = true;
      this.player.anims.play("hurts", true);
      this.player.once('animationcomplete-hurts', () => this.player.estaHerido = false);

      this.player.stats.vida--;
      const corazon = this.corazones[this.player.stats.vida];
      if (corazon) corazon.setTint(0x808080);

      await this.esperarSonido(this.sonidoHurt);

      if (this.player.stats.vida <= 0) {
        this.sonidoDead.play();
        this.player.setActive(false).setVisible(false);
        this.player.stats.activo = false
        this.time.delayedCall(2000, () => {
        this.scene.start("LoseScene");
    })
      }
    }
  }

  update(time) {
    const speed = this.player.stats.velocidad;
    if (this.boss1 && this.boss1.lifeBar && this.boss1.lifeBarBg) {
    this.boss1.lifeBar.x = this.boss1.x;
    this.boss1.lifeBar.y = this.boss1.y - 100;
    this.boss1.lifeBarBg.x = this.boss1.x;
    this.boss1.lifeBarBg.y = this.boss1.y - 100;
  }

   const intervaloDisparo = 1500; // cada 1.5 segundos

  if (this.boss1.stats.activo && this.player.active) {
    if (time > this.ultimoDisparoBoss + intervaloDisparo) {
      this.ultimoDisparoBoss = time;
      switch (this.boss1.stats.patronActual) {
        case 1: this.disparoDirecto(); break;
        case 2: this.disparoRafaga(); break;
        case 3: this.disparoCircular(); break;
      }
    }
  }
    if (Phaser.Input.Keyboard.JustDown(this.teclaHit)) this.perderVida();
    // patron de ataque
    if (this.boss1.stats.vida <= 1000) this.boss1.stats.patronActual = 1;
    if (this.boss1.stats.vida <= 600) this.boss1.stats.patronActual = 2;
    if (this.boss1.stats.vida <= 300) this.boss1.stats.patronActual = 3;

    
    // Destruir balas fuera de pantalla
    this.balas.children.iterate(bala => {
      if (!bala.active) return;
      if (bala.x < 0 || bala.x > 800 || bala.y < 0 || bala.y > 600) bala.setActive(false).setVisible(false);
    });

    this.balasBoss.children.iterate(bala => {
      if (!bala.active) return;
      if (bala.x < 0 || bala.x > 800 || bala.y < 0 || bala.y > 600) bala.setActive(false).setVisible(false);
    });

    // Disparo con WASD
    if (Phaser.Input.Keyboard.JustDown(this.teclasAtaque.up)) this.disparar(this.player.x, this.player.y, 0, -500);
    if (Phaser.Input.Keyboard.JustDown(this.teclasAtaque.down)) this.disparar(this.player.x, this.player.y, 0, 500);
    if (Phaser.Input.Keyboard.JustDown(this.teclasAtaque.left)) this.disparar(this.player.x, this.player.y, -500, 0);
    if (Phaser.Input.Keyboard.JustDown(this.teclasAtaque.right)) this.disparar(this.player.x, this.player.y, 500, 0);

    if (!this.player.estaHerido) {
      if (!this.player.body.touching.down) this.player.anims.play("jump", true);
      else if (this.cursors.left.isDown) { this.player.setVelocityX(-speed); this.player.anims.play("walk", true); this.player.setFlipX(true); }
      else if (this.cursors.right.isDown) { this.player.setVelocityX(speed); this.player.anims.play("walk", true); this.player.setFlipX(false); }
      else { this.player.setVelocityX(0); this.player.anims.play("idle", true); }
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) this.player.setVelocityY(-500);

    // Movimiento jefe
    if (this.boss1.stats.activo) {
      this.boss1.setVelocityX(this.boss1.stats.velocidad * this.boss1.stats.direccion);
      if (this.boss1.x <= 200) { this.boss1.stats.direccion = 1; this.boss1.setFlipX(true); }
      else if (this.boss1.x >= 600) { this.boss1.stats.direccion = -1; this.boss1.setFlipX(false); }
    } else {
      this.boss1.setVelocityX(0, 0)
    }
  }
}
