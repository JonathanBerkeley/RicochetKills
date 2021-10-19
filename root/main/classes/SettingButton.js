class SettingButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key, hoverKey, text, bool, mORl) {
        super(scene, x, y);
        this.scene = scene; // the scene this container will be added to
        this.x = x; // the x position of our container
        this.y = y; // the y position of our container
        this.key = key; // the background image of our button
        this.hoverKey = hoverKey; // the image that will be displayed when the player hovers over the button
        this.text = text.toUpperCase(); // the text that will be displayed on the button, made uppercase to fit the theme
        this.bool = bool; // the callback function that will be called when the player clicks the button
        this.mORl = mORl;

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

        if (this.mORl == 1) {
            if (!muteGame)
                this.buttonText.setColor("#ff0000");
            if (muteGame)
                this.buttonText.setColor("#00cc00");
        }
        if (this.mORl == 2) {
            if (!showLine)
                this.buttonText.setColor("#ff0000");
            if (showLine)
                this.buttonText.setColor("#00cc00");
        }
        // add the two game objects to our container
        this.add(this.button);
        this.add(this.buttonText);
        // listen for events
        this.button.on('pointerover', () => {
            this.button.setTexture(this.hoverKey);
        });
        this.button.on('pointerout', () => {
            this.button.setTexture(this.key);
        });
        this.button.on('pointerdown', () => {
            if (this.mORl == 1) {
                var menuClick = new Audio('../assets/sound/menuClick.wav'); //Javascript way to load audio, since uibutton doesn't inherit phaser scene
                muteGame = !muteGame;
                if (!muteGame){
                    this.buttonText.setColor("#ff0000");
                    music.play(musicConfig);
                    menuClick.play(); //Plays audio on click
                }
                if (muteGame){
                    music.stop();
                    this.buttonText.setColor("#00cc00");
                }
            } else if (this.mORl == 2) {
                var menuClick = new Audio('../assets/sound/menuClick.wav'); //Javascript way to load audio, since uibutton doesn't inherit phaser scene
                if (!muteGame)
                    menuClick.play(); //Plays audio on click
                showLine = !showLine;
                if (!showLine)
                    this.buttonText.setColor("#ff0000");
                if (showLine)
                    this.buttonText.setColor("#00cc00"); //Changes colour to indicate status
            }
        });
    }
}