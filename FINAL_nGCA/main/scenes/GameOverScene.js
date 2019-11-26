class GameOverScene extends Phaser.Scene {
  constructor() {
      super('GameOver');
  }

  init() {
      if (cDebug) {
          console.log("----Gameoverscene begins----");
          console.log("Highscore: " + highScore + " Score: " + score);
      }
      this.scaleW = this.sys.game.config.width;
      this.scaleH = this.sys.game.config.height;
      if (highScore < score) { //For setting new highscores
          highScore = score;
      }
  }

create() {
    //Add art
    this.add.image(this.scaleW / 2, this.scaleH * 0.22, 'gameOver').setOrigin(0.5);
    this.add.image(this.scaleW * 0.84, this.scaleH * 0.85, 'babyYoda');

    this.deathText = "Out of ammo you are!";
    this.scoreText = this.add.text(this.scaleW/2, this.scaleH * 0.53, this.deathText + "\n" + "\nScore: " + score + "\nHigh score: " + highScore, {
        fontFamily: "spacefont",
        fontSize: '48px',
        fill: '#ceb04d'
    }).setOrigin(0.5);
    //Create the play again button
    this.startGameButton = new UiButton(this, this.scaleW / 2, this.scaleH * 0.82, 'button1', 'button2', 'MAIN MENU', this.startScene.bind(this, 'Title'));
}

  startScene(targetScene) {
      this.scene.start(targetScene);
  }

}