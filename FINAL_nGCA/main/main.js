var currentScene = 0; //Used for figuring out which scene the user is seeing
var cDebug = false; //Used for console log statements throughout the program for debugging if there's a problem
var config = {
  type: Phaser.AUTO,
  scale: {
      parent: 'ricochet-game',
      autoCenter: Phaser.Scale.autoCenter,
      width: (innerWidth-20),
      height: (innerHeight-20)
  },
  scene: [
     BootScene,
     TitleScene,
     GameScene,
     HelpScene,
     OptionScene,
     GameOverScene
  ],
  physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { y: 200 }
      },
  },
};
var game = new Phaser.Game(config);

