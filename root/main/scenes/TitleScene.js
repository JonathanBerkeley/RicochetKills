//pure js reload checking function (reloads current page on window resize)
document.getElementsByTagName("BODY")[0].onresize = function() {
  if (currentScene === 1) {
      window.location.reload(false);
  }
}
class TitleScene extends Phaser.Scene {
  constructor() {
      super('Title');
  }


  init() {
      score = 0;
      currentScene = 1;
      if (cDebug) {
          console.log("----Titlescene begins----");
          console.log("Game fullscreen: " + isFullScreen);
      }
      this.scaleW = this.sys.game.config.width;
      this.scaleH = this.sys.game.config.height;
  }

  create() {
      this.createBackground(); //Background

      // this.add.image(0, 0, 'titleBackground');
      // var titleBackground=this.add.sprite(100,100, 'titleBackground');

      //Title img
      this.add.image(this.scaleW / 2, 200, 'title');

      // create the Play game button
      this.startGameButton = new UiButton(this, this.scaleW / 2, this.scaleH * 0.48, 'button1', 'button2', 'PLAY GAME', this.startScene.bind(this, 'Game'));

      // create the Options game button
      this.startOptionButton = new UiButton(this, this.scaleW / 2, this.scaleH * 0.65, 'button1', 'button2', 'OPTIONS', this.startScene.bind(this, 'Options'));

      // create the Help game button
      this.startHelpButton = new UiButton(this, this.scaleW / 2, this.scaleH * 0.82, 'button1', 'button2', 'HELP', this.startScene.bind(this, 'Help'));
  }

  startScene(targetScene) {
      this.scene.start(targetScene);
  }

  createBackground() {
      this.bg = this.add.sprite(0, 0, 'titleBackground');
      this.bg.displayHeight = game.config.height;
      this.bg.displayWidth = game.config.width * 2;
      this.bg.setOrigin(0, 0);
  }

  update() {
      this.bg.x -= 0.5; //Background animation
      if (this.bg.x < -1000) {
          this.bg.x = 0;
      }
  }

}