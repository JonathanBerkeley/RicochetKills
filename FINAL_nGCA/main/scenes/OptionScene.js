class OptionScene extends Phaser.Scene {
  constructor() {
      super('Options');
  }

  init() {
      if (cDebug) {
          console.log("----Optionscene begins----");
      }
      this.scaleW = this.sys.game.config.width;
      this.scaleH = this.sys.game.config.height;
  }

  create() {

      //create help menu img
      this.add.image(this.scaleW / 2, this.scaleH * 0.22, 'options');
      //create draw previous shot line
      this.startDrawButton = new SettingButton(this, this.scaleW / 2, this.scaleH * 0.48, 'button1', 'button2', 'AIM ASSIST', this.startScene.bind(this, 'Title'), 2);
      //create mute button
      this.startMuteButton = new SettingButton(this, this.scaleW / 2, this.scaleH * 0.65, 'button1', 'button2', 'MUTE SFX', this.startScene.bind(this, 'Title'), 1);
      //create the back button
      this.startGameButton = new UiButton(this, this.scaleW / 2, this.scaleH * 0.82, 'button1', 'button2', 'Go Back', this.startScene.bind(this, 'Title'));
  }

  startScene(targetScene) {
      this.scene.start(targetScene);
  }
}