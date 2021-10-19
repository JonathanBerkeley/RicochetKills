class UiButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key, hoverKey, text, targetCallback) {
      super(scene, x, y);
      this.scene = scene; // the scene this container will be added to
      this.x = x; // the x position of our container
      this.y = y; // the y position of our container
      this.key = key; // the background image of our button
      this.hoverKey = hoverKey; // the image that will be displayed when the player hovers over the button
      this.text = text.toUpperCase(); // the text that will be displayed on the button, made uppercase to fit the theme
      this.targetCallback = targetCallback; // the callback function that will be called when the player clicks the button

      // create our Ui Button
      this.createButton();
      // add this container to our Phaser Scene
      this.scene.add.existing(this);
  }

  createButton() {
      // create play game button
      this.button = this.scene.add.image(0, 0, 'button1');
      // make button interactive
      this.button.setInteractive();
      // scale the button
      this.button.setScale(0.65);

      // create the button text
      this.buttonText = this.scene.add.text(0, 0, this.text, {
          fontFamily: "spacefont",
          fontSize: '46px',
          fill: '#0090d2'
      });

      // center the button text inside the Ui button
      Phaser.Display.Align.In.Center(this.buttonText, this.button);

      // add the two game objects to our container
      this.add(this.button);
      this.add(this.buttonText);

      // listen for events
      this.button.on('pointerdown', () => {
          var menuClick = new Audio('../assets/sound/menuClick.wav'); //Javascript way to load audio, since uibutton doesn't inherit phaser scene
          if(!muteGame)
            menuClick.play(); //Plays audio on click
          this.targetCallback();
      });

      this.button.on('pointerover', () => {
          this.button.setTexture(this.hoverKey);
          this.buttonText.setColor("#ceb04d"); //Colour change indicates hovering
      });

      this.button.on('pointerout', () => {
          this.button.setTexture(this.key);
          this.buttonText.setColor("#0090d2");
      });
  }
}