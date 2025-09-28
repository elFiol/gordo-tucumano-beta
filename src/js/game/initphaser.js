import Phaser from "phaser";
import GameScene from "./gamescene";

export function initPhaser(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: containerId,physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 400 },
      debug: false
    }
  },
    scene: [GameScene]
  });
}