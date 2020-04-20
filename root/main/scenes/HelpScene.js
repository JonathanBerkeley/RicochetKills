class HelpScene extends Phaser.Scene {
  constructor() {
      super('Help');
  }

  init() {
      if (cDebug) {
          console.log("----Helpscene begins----");
      }
      this.scaleW = this.sys.game.config.width;
      this.scaleH = this.sys.game.config.height;
  }

  create() {
      //create help menu img
      this.add.image(this.scaleW / 2, 200, 'helpMenu');
      //create the back button
      this.startGameButton = new UiButton(this, this.scaleW / 2, this.scaleH * 0.85, 'button1', 'button2', 'Go Back', this.startScene.bind(this, 'Title'));
      this.helpText = "The objective of this game is to eliminate all enemies.";
      this.helpText2 = "Your hero is equipped with a laser capable of ricocheting off all surfaces " + MAX_BOUNCE_COUNT + " times."; //TODO: Enter help text here then remove this comment
      this.helpText3 = "Use this to ricochet your bullets around corners and obstacles to obtain victory!";
      this.helpText4 = "But use your " + MAX_AMMO + " shots wisely, if you run out you lose.";
      this.helpText5 = "The game is infinite and randomally generated, each level is unique!";
      this.helpText6 = "Try obtain as high a score as possible, your highest score will be kept at the end of a run";
      this.helpText7 = "You get rewarded more for multikills and multiple ricochets before kills. Good luck!";
      this.controlText = "Press ESC ingame to return to the main menu";
      this.scoreText = this.add.text(this.scaleW/2, this.scaleH * 0.50, this.helpText + "\n" + this.helpText2 + "\n" + this.helpText3  + "\n" + this.helpText4  + "\n" + this.helpText5  + "\n" + this.helpText6 + "\n" + this.helpText7 + "\n\n" + this.controlText, {
        fontFamily: "spacefont",
        fontSize: '32px',
        fill: '#ceb04d'
      }).setOrigin(0.5);
  }

  startScene(targetScene) {
      this.scene.start(targetScene);
  }
}