var spriteScale; //Handles window resizing pre-init
if (innerHeight > 900 && innerWidth > 1000) {
    spriteScale = 0.75;
} else if (innerHeight <= 900 && innerWidth <= 1000) {
    spriteScale = 0.5;
} else {
    spriteScale = 0.5;
}
if (innerHeight <= 700 || innerWidth <= 1000) { //Disallow a window size that is too small
    if (!alert("Game window is too small, this game is recommended for play in fullscreen. (PRESS F11 then OK)")) {
        window.location.reload();
    }
}
var ESCKey;
var score = 0;
const MAX_AMMO = 5; //Change to change starting ammo
const MAX_BOUNCE_COUNT = 6; //Change to change amount of bounces allowed before laser destroyed
const shooterPointx = innerWidth / 20;
const shooterPointy = innerHeight - (innerHeight / 10);
class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }
    init() {
        if (cDebug)
            console.log("----Gamescene begins----");
        this.ignoreDupes = 0;
        this.storeLast = -1;
        this.clickposx;
        this.clickposy;
        //this.shootAngle; //Possible future feature
        //this.armAngle;
        this.switchThis = true;
        this.rRecChange = 0;
        this.rRecChange2 = 0;
        this.requestedEnemyCount = randomNumberFromRange(4, 6); //Change this to generate more enemies
        this.requestedObstacleCount = randomNumberFromRange(10, 20); //Change this to generate more obstacles
        this.killCount = 0;
        this.bounceCount = 0;
        this.allowShooting = true;
        this.lastAngle;
        this.bTick = 0;
        this.tickrate = 0;
        this.shootTick = 0;
        this.logShootTick = 11000;
        this.logForBounce = 0;
        currentScene = 2;
        //Sets ammo to global value
        this.ammunition = MAX_AMMO;

        //obj for out line
        this.graphics;
        this.myline;
        ESCKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    create() {
        this.createBackground();
        this.createPlayer();
        this.createEnemiesAndObstacles();
        this.createText();
        this.createGraphics();
    }

    createGraphics() {
        var setWidth = 0;
        if(showLine){ //User setting for line guide for last shot
            setWidth=4;
        }
        this.graphics = this.add.graphics({ //Graphics for shooting trace line
            lineStyle: {
                width: setWidth,
                color: 0xff0000
            }
        });
        this.myline = new Phaser.Geom.Line(shooterPointx, shooterPointy, 0, 0);
    }


    createBackground() {
        var randomBg = randomNumberFromRange(1, 3); //Picks one of the three backgrounds available
        if (randomBg === 1)
            this.bg = this.add.sprite(0, 0, 'b1');
        if (randomBg === 2)
            this.bg = this.add.sprite(0, 0, 'b2');
        if (randomBg === 3)
            this.bg = this.add.sprite(0, 0, 'b3');
        this.bg.displayHeight = game.config.height; //Dynamic resizing
        this.bg.displayWidth = game.config.width;
        this.bg.setOrigin(0, 0);
        this.infobar = this.add.sprite(0, 0, 'infobar');
        this.infobar.displayHeight = game.config.height / 100 + 15;
        this.infobar.displayWidth = game.config.width;
        this.infobar.setOrigin(0, 0);
    }
    createPlayer() {
        this.player = this.physics.add.sprite(shooterPointx, shooterPointy, 'player');
        this.player.setScale(spriteScale);
        this.player.setCollideWorldBounds(true);
        //Future feature:
        //this.playerArm = this.add.sprite(shooterPointx+27,shooterPointy+17,'playerarm');
        //this.playerArm.setScale(spriteScale);
        //this.playerArm.setAllowRotation = true;
    }


    createEnemiesAndObstacles() {
        this.enemy = [];
        for (var i = 0; i < this.requestedEnemyCount; i++) { //Responsible for enemy generation
            this.enemy[i] = this.physics.add.sprite(randomNumberFromRange(0, innerWidth), randomNumberFromRange(0, innerHeight / 2), 'enemy');
            if (this.enemy[i].x < shooterPointx + (innerWidth / 10) + 50) {
                this.enemy[i].x += innerWidth / 3;
            }
            this.enemy[i].setScale((spriteScale*2)+0.30);
            this.physics.world.enable([this.enemy[i]]);
            this.enemy[i].body.setAllowGravity(true);
            this.enemy[i].body.setGravity(0, 20000); //Makes enemies fall into position
            this.enemy[i].setCollideWorldBounds(true); //Properties for enemies set
        }
        this.obstacle = [];
        for (var x = 0; x < this.requestedObstacleCount; x++) { //Responsible for obstacle generation
            var pickPlatform = randomNumberFromRange(1, 3);
            if (pickPlatform === 1)
                this.obstacle[x] = this.physics.add.sprite(randomNumberFromRange(0, innerWidth), randomNumberFromRange(0, innerHeight), 'platform1');
            if (pickPlatform === 2)
                this.obstacle[x] = this.physics.add.sprite(randomNumberFromRange(0, innerWidth), randomNumberFromRange(0, innerHeight), 'platform3');
            if (pickPlatform === 3)
                this.obstacle[x] = this.physics.add.sprite(randomNumberFromRange(0, innerWidth), randomNumberFromRange(0, innerHeight), 'platform3R');
            this.obstacle[x].setScale(spriteScale);
            this.physics.world.enable([this.obstacle[x]]);
            this.obstacle[x].body.setAllowGravity(false);
            this.obstacle[x].body.setImmovable(true);
            this.obstacle[x].setCollideWorldBounds(true);
            this.physics.add.collider(this.enemy, this.obstacle); //Properties for obstacles set
            if (this.obstacle[x].x < shooterPointx + (innerWidth / 10) + 50 && this.obstacle[x].y >= innerHeight - (innerHeight / 3)) { //Destroys any platforms that spawn too close to the player
                this.obstacle[x].destroy();
            }
            if (this.obstacle[x].y <= innerHeight - (innerHeight / 2)) {
                this.obstacle[x].y += innerHeight / 4;
            }
            /* Future feature. Prevent overlapping of platforms
            for(var z = 0; z < this.requestedObstacleCount; z++){
                if(this.obstacle[x].y >= this.obstacle[z].y){
                    console.log("overlapping");
                }
            }
            */
        }
    }

    createLaser() { //Laser created when shooting
        this.laser = this.physics.add.sprite(shooterPointx, shooterPointy, 'laser');
        this.laser.setScale(spriteScale);
        this.physics.world.enable([this.laser]);
        this.physics.moveTo(this.laser, game.input.mousePointer.x, game.input.mousePointer.y, 1000);
        this.laser.body.setAllowDrag(false).setAllowGravity(false).setAllowRotation(true).setMaxSpeed(1000).setMaxVelocity(1000, 1000);
        this.laser.body.setBounce(1, 1).setCollideWorldBounds(true); //Bounce handles ricochets
        this.physics.add.collider(this.obstacle, this.laser); //Checks for collisions with obstacles
    }

    createText() { //Initial text on infobar
        this.textKillCount = this.add.text(innerWidth/2, 10, "KILLS: " + this.killCount + "/" + this.requestedEnemyCount, {
            fontFamily: "spacefont",
            fontSize: '16px',
            fill: '#0090d2'
        }).setOrigin(0.5);
        this.textAmmunition = this.add.text(innerWidth/2 - this.textKillCount.width - 20, 10, "AMMO: " + this.ammunition + "/" + MAX_AMMO, {
            fontFamily: "spacefont",
            fontSize: '16px',
            fill: '#0090d2'
        }).setOrigin(0.5);
        this.textScore = this.add.text(innerWidth/2 + this.textKillCount.width + 20, 10, "SCORE: " + score, {
            fontFamily: "spacefont",
            fontSize: '16px',
            fill: '#0090d2'
        }).setOrigin(0.5);
    }

    //gameLoop
    update() {
        this.switchThis = !this.switchThis; //Boolean switch used for bounce checking
        this.tickrate++; //Tickrate for internal timing
        if (this.tickrate === 10000) {
            this.tickrate = 40;
        }
        if (ESCKey.isDown){ //Allows quitting to main menu
            if (confirm("Quit to main menu?")) {
                this.scene.start('Title');
            }
        }
        //Future feature:
        //armAngle = Phaser.Math.Angle.Between(shooterPointx+27,shooterPointy-10,game.input.mousePointer.x,game.input.mousePointer.y);
        //this.playerArm.setRotation(armAngle+Math.PI/2);
        if (this.ammunition < MAX_AMMO && this.bounceCount < MAX_BOUNCE_COUNT) {
            this.allowShooting = false; //Prevents player from shooting while a laser is active
            for (var i = 0; i < this.requestedEnemyCount; i++) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.laser.getBounds(), this.enemy[i].getBounds())) { //Collision with laser detection
                    if(!muteGame)
                        this.generateRandomDeathSound(); //Responsible for random enemy death audio playing
                    this.enemy[i].body.setAllowGravity(false);
                    this.enemy[i].setCollideWorldBounds(false);
                    this.enemy[i].y = 10000; //Sends them off screen
                    this.enemy[i].x = 10000;
                    if (cDebug) {
                        console.log("All enemy positions:");
                        this.enemy.forEach(valu => console.log("Enemy x value: " + valu.x + " Enemy y value: " + valu.y));
                    }
                    if (this.enemy[i].x === 10000 && this.enemy[i].y === 10000) { //Checks if enemies are in dead zone
                        this.killCount++;
                        //Bonus adding section, rewards skillful shots
                        if(this.bounceCount > 1)
                            score+= 25;
                        if(this.bounceCount > 3)
                            score+= 25;
                        if(this.bounceCount > 5)
                            score+= 25; //Bonus for ricocheting projectile, skill bonus
                        if (this.ammunition === MAX_AMMO - 1) {
                            score += 125; //First shot bonus
                        } else {
                            score += 100; //Base score increase for kill
                        }
                        if (this.ammunition === MAX_AMMO - 1 && this.killCount === this.requestedEnemyCount) {
                            score += 500; //First shot killed all enemies bonus
                        }
                        if (this.ammunition === MAX_AMMO - 2 && this.killCount === this.requestedEnemyCount) {
                            score += 250; //Second shot killed remaining enemies bonus
                        }
                        if (this.ammunition === MAX_AMMO - 3 && this.killCount === this.requestedEnemyCount) {
                            score += 100; //Third shot killed remaining enemies bonus
                        }
                        this.textScore.destroy();
                        this.textScore = this.add.text(innerWidth/2 + this.textKillCount.width + 20, 10, "SCORE: " + score, {
                            fontFamily: "spacefont",
                            fontSize: '16px',
                            fill: '#0090d2'
                        }).setOrigin(0.5);
                        this.textKillCount.destroy(); //Clears previous text
                        this.textKillCount = this.add.text(innerWidth/2, 10, "KILLS: " + this.killCount + "/" + this.requestedEnemyCount, {
                            fontFamily: "spacefont",
                            fontSize: '16px',
                            fill: '#0090d2'
                        }).setOrigin(0.5);
                        if (cDebug)
                            console.log("Killcount: " + this.killCount);
                        if (this.killCount == this.requestedEnemyCount) { //Ends game if all enemies have been hit
                            this.ignoreDupes = 1;
                            this.storeLast = -1; //Fixes bug with mouse positioning
                            this.victory();
                        }
                    }
                }
            }
            this.bTick++; //Used for checking for ricochets, limiting activation of following code
            this.laser.angle = Phaser.Math.RadToDeg(this.laser.body.angle);
            if (this.bTick > 1 && this.switchThis) {
                this.rRecChange = this.laser.body.angle; //Checks first angle value
            }
            if (this.bTick > 1 && !this.switchThis) {
                this.rRecChange2 = this.laser.body.angle; //Checks second angle value
            }
            if (this.bTick > 2 && this.rRecChange != this.rRecChange2) { //Compares angles, if they are different then continue
                this.bounceCount++;
                if (this.bounceCount === MAX_BOUNCE_COUNT) { //Laser has set amount it can bounce, check done here
                    this.laser.destroy();
                    this.allowShooting = true; //Allows player to shoot again
                }
                if(!muteGame)
                    this.generateRandomRicochetSound(); //Responsible for playing a random ricochet sound
                this.bTick = 0;
                this.rRecChange = 0;
                this.rRecChange2 = 0; //Reset values for next laser
            }
        }
        //shootAngle = Phaser.Math.Angle.Between(shooterPointx,shooterPointy, clickposx, clickposy);

        //Prevents duplicate shots, takes mouse input x and y and compares it to constants
        if (game.input.mousePointer.isDown && this.tickrate > 41 && this.ammunition >= 1 && this.allowShooting) {
            if (this.tickrate >= this.logShootTick + 50 || this.ammunition === MAX_AMMO) {
                this.ignoreDupes = game.input.mousePointer.x + game.input.mousePointer.y;
                if (this.ignoreDupes != this.storeLast) {
                    if(!muteGame)
                        this.sound.play('shoot');
                    this.bounceCount = 0;
                    this.createLaser();
                    this.lastAngle = Phaser.Math.RadToDeg(Phaser.Geom.Line.Angle(this.myline));
                    this.logShootTick = this.tickrate;
                    this.logForBounce = this.tickrate;
                    this.ammunition--;
                    this.textAmmunition.destroy();
                    if (this.ammunition === 0)
                        this.textAmmunition = this.add.text(innerWidth/2 - this.textKillCount.width - 20, 10, "AMMO: " + this.ammunition + "/" + MAX_AMMO, {
                            fontFamily: "spacefont",
                            fontSize: '16px',
                            fill: '#ff0000'
                        }).setOrigin(0.5);
                    else {
                        this.textAmmunition = this.add.text(innerWidth/2 - this.textKillCount.width - 20, 10, "AMMO: " + this.ammunition + "/" + MAX_AMMO, {
                            fontFamily: "spacefont",
                            fontSize: '16px',
                            fill: '#0090d2'
                        }).setOrigin(0.5);
                    }
                    //this.laser.setAngle(lastAngle);

                    //this.laser = this.add.sprite(shooterPointx,shooterPointy,'laser');
                    //this.laser.setAngle(lastAngle);
                    this.clickposx = game.input.mousePointer.x;
                    this.clickposy = game.input.mousePointer.y;
                    if (cDebug) {
                        console.log("Click pos: " + clickposx, clickposy);
                        console.log("Click angle: " + Phaser.Math.RadToDeg(Phaser.Geom.Line.Angle(this.myline)));
                    }
                    this.storeLast = this.ignoreDupes;
                    this.myline.x2 = this.clickposx;
                    this.myline.y2 = this.clickposy;
                }
            }
            this.graphics.strokeLineShape(this.myline);
        }
        if (this.ammunition <= 0 && this.bounceCount === MAX_BOUNCE_COUNT) {
            if (this.logShootTick + 250 < this.tickrate) //Adds a delay so game doesn't end instantly
                this.gameOver();
        }
    }

    generateRandomRicochetSound() {
        var randomRicochetSound = randomNumberFromRange(1, 10);
        this.sound.volume = 0.7;
        if (randomRicochetSound === 1)
            this.sound.play('ricochet1');
        else if (randomRicochetSound === 2)
            this.sound.play('ricochet2');
        else if (randomRicochetSound === 3)
            this.sound.play('ricochet3');
        else if (randomRicochetSound === 4)
            this.sound.play('ricochet4');
        else if (randomRicochetSound === 5)
            this.sound.play('ricochet5');
        else if (randomRicochetSound === 6)
            this.sound.play('ricochet6');
        else if (randomRicochetSound === 7)
            this.sound.play('ricochet7');
        else if (randomRicochetSound === 8)
            this.sound.play('ricochet8');
        else if (randomRicochetSound === 9)
            this.sound.play('ricochet9');
        else if (randomRicochetSound === 10)
            this.sound.play('ricochet10');
    }
    generateRandomDeathSound() {
        var randomDeathSound = randomNumberFromRange(1, 6);
        if (randomDeathSound === 1)
            this.sound.play('death1');
        if (randomDeathSound === 2)
            this.sound.play('death2');
        if (randomDeathSound === 3)
            this.sound.play('death3');
        if (randomDeathSound === 4)
            this.sound.play('death4');
        if (randomDeathSound === 5)
            this.sound.play('death5');
        if (randomDeathSound === 6)
            this.sound.play('death6');
    }
    gameOver() { //For gameover events
        this.scene.start('GameOver');
    }
    victory() { //For victory (generates new level)
        this.scene.start('Game');
    }

}

function randomNumberFromRange(min, max) { //Used for all random number generation between range min and max
    return Math.round(Math.random() * (max - min) + min);
}