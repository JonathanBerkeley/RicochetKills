var highScore = 0; //Global variable for highscore, declared here so it doesn't get changed
var music, musicConfig; //For main music
var muteGame = false; //These two booleans used for settings
var showLine = false; //Global variables set
class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    init() {
        if (cDebug) {
            console.log("----Bootscene begins----");
        }
    }

    preload() { //Calls the other functions in this file
        this.loadImages();
        this.loadAudio();
    }

    loadImages() { //Responsible for loading in sprites and images used in all parts of the game
        this.load.image('platform1', '/assets/sprites/p1.png');
        this.load.image('platform3', '/assets/sprites/p3.png');
        this.load.image('platform3R', '/assets/sprites/p3R.png');
        this.load.image('title', '../assets/title.png');
        this.load.image('helpMenu', '../assets/helpMenu.png')
        this.load.image('options', '../assets/options.png')
        this.load.image('gameOver', '../assets/gameOver.png');
        this.load.image('babyYoda', '../assets/babyYoda.png');
        this.load.image('titleBackground', '../assets/Sprites/titleBackground.png');
        this.load.image('b1', '/assets/sprites/b1.jpg');
        this.load.image('b2', '/assets/sprites/b2.png');
        this.load.image('b3', '/assets/sprites/b3.png');
        this.load.image('infobar', '/assets/sprites/infobar.png');
        this.load.image('enemy', '/assets/sprites/stormtrooper.png');
        this.load.image('laser', '../assets/Sprites/lazer.png');
        this.load.image('player', '/assets/sprites/rebeln.png');
        this.load.image('button1', '/assets/sButton1.png');
        this.load.image('button2', '/assets/sButton2.png');
    }

    loadAudio() { //Responsible for loading in audio used in all parts of the game
        var chooseAudio = randomNumberFromRange(1,3); //Picks a random song to load
        if(chooseAudio === 1)
            this.load.audio('menuMusic', '/assets/music/track1.mp3');
        if(chooseAudio === 2)
            this.load.audio('menuMusic', '/assets/music/track2.mp3');
        if(chooseAudio === 3)
            this.load.audio('menuMusic', '/assets/music/track3.mp3');
        this.load.audio('menuClick', '/assets/sound/menuClick.wav');
        this.load.audio('ricochet1', '/assets/sound/ricochet1.ogg');
        this.load.audio('ricochet2', '/assets/sound/ricochet2.ogg');
        this.load.audio('ricochet3', '/assets/sound/ricochet3.ogg');
        this.load.audio('ricochet4', '/assets/sound/ricochet4.ogg');
        this.load.audio('ricochet5', '/assets/sound/ricochet5.ogg');
        this.load.audio('ricochet6', '/assets/sound/ricochet6.ogg');
        this.load.audio('ricochet7', '/assets/sound/ricochet7.ogg');
        this.load.audio('ricochet8', '/assets/sound/ricochet8.ogg');
        this.load.audio('ricochet9', '/assets/sound/ricochet9.ogg');
        this.load.audio('ricochet10', '/assets/sound/ricochet10.ogg');
        this.load.audio('shoot', '/assets/sound/shoot.ogg');
        this.load.audio('death1', '/assets/sound/death1.ogg');
        this.load.audio('death2', '/assets/sound/death2.ogg');
        this.load.audio('death3', '/assets/sound/death3.ogg');
        this.load.audio('death4', '/assets/sound/death4.ogg');
        this.load.audio('death5', '/assets/sound/death5.ogg');
        this.load.audio('death6', '/assets/sound/death6.ogg');
    }

    create() { //Begins title scene
        this.scene.start('Title');
        music = this.sound.add("menuMusic");
        musicConfig = {
          mute: muteGame,
          volume: 0.3,
          loop: true,
          rate: 1,
          detune: 0,
          delay: 0
        }
        music.play(musicConfig);
    }
}