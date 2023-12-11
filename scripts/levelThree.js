// phaser class for level one scene
class LevelThree extends Phaser.Scene {

    constructor() {

        super({key: 'LevelThree'});

        // add variables
        this.ship;
        this.enemyShip
        this.bullet;
        this.enemyBullet;
        this.controls;
        this.score = 0;
        this.protectionLevel = 10;
        this.isPaused = false;
        this.greenSquare = [];
        this.yellowSquare = [];
        this.redSquare = [];
        this.gameOver = false;
        this.escape;
        this.playerAmmo = 20;
        this.asteroids = [];

        // booster particle config
        this.particleConfig = {
            // set the initial speed of the particles
            speed: 100,
            // configure lifespan of each particle
            lifespan: {
                onEmit: (particle, key, t, value) => {
                    return Phaser.Math.Percent(this.ship.body.speed, 0, 300) * 2000;
                }
            },
            // set transparency of each particle
            alpha: {
                onEmit: (particle, key, t, value) =>
                {
                    return Phaser.Math.Percent(this.ship.body.speed, 0, 300);
                }
            },
            // setinitial angle of each particle when emitted
            angle: {
                onEmit: (particle, key, t, value) =>
                {
                    return (this.ship.angle - 180) + Phaser.Math.Between(-10, 10);
                }
            },
            // set initial and final scale of each particle
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD'
        };
        
        
    }


    preload() {

        // load background image
        this.load.image('game-background', 'assets/background.jpg');

        // load planets
        this.load.image('stars', 'assets/Planets/stars.png');
        this.load.image('sun', 'assets/Planets/sun.png');
        this.load.image('earth', 'assets/Planets/earth.png');
        this.load.image('moon', 'assets/Planets/moon.png');
        this.load.image('moon1', 'assets/Planets/moon1.png');
        this.load.image('moon2', 'assets/Planets/moon2.png');
        this.load.image('moon3', 'assets/Planets/moon3.png');
        this.load.image('moon6', 'assets/Planets/moon6.png');
        this.load.image('brown-planet', 'assets/Planets/brown-planet.png');
        this.load.image('purple-planet', 'assets/Planets/purple-planet.png');

        // load ships
        this.load.image('ship', 'assets/Player/ship.png');
        this.load.image('enemy-ship', 'assets/Enemy/enemy-ship.png');

        // load objects/FX
        this.load.image('booster', 'assets/Player/booster.png');
        this.load.image('enemy-booster', 'assets/Enemy/enemy-booster.png');
        this.load.image('bullet', 'assets/Player/bullet.png');
        this.load.image('enemy-bullet', 'assets/Enemy/enemy-bullet.png');
        this.load.image('explosion', 'assets/FX/flash.png');
        this.load.image('circle', 'assets/Player/circle.png')
        this.load.image('red', 'assets/FX/squareRed.png');
        this.load.image('yellow', 'assets/FX/squareYellow.png');
        this.load.image('green', 'assets/FX/squareGreen.png');
        this.load.image('asteroid', 'assets/Obstacles/asteroid.png');

    }

    create() {

        // add background
        const space = this.add.image(0, 0, 'game-background').setScrollFactor(0);
        space.setOrigin(0, 0); 

        // add planets
        this.add.image(750, 40, 'sun').setScale(.3);
        this.add.image(-250, 300, 'earth').setScale(1);
        this.add.image(950, 800, 'moon').setScale(1);
        this.add.image(-2000, -200, 'moon1').setScale(1.5);
        this.add.image(-600, -900, 'moon2').setScale(1.5);
        this.add.image(-300, 2000, 'moon3').setScale(1.5);
        this.add.image(800, 1200, 'moon6').setScale(1);
        this.add.image(2000, 700, 'brown-planet').setScale(.5);
        this.add.image(1000, -800, 'purple-planet').setScale(.5);
        this.stars = this.add.tileSprite(400, 300, 800, 600, 'stars').setScrollFactor(0);

       // add protection level indicators
        for (let i = 0; i < 4; i++) {
         this.redSquare[i] = this.add.image(30 + i * 25, 560, 'red').setScrollFactor(0);
        }

        for (let i = 0; i < 4; i++) {
            this.yellowSquare[i] = this.add.image(130 + i * 25, 560, 'yellow').setScrollFactor(0);
        }

        for (let i = 0; i < 4; i++) {
            this.greenSquare[i] = this.add.image(233 + i * 25, 560, 'green').setScrollFactor(0);
        }

        // add player ship and set angle
        this.ship = this.physics.add.image(450, 300, 'ship', null).setScale(0.5);
        this.ship.setAngle(-90);

        // control how quickly the ship slows down
        this.ship.setDrag(300);
        this.ship.setAngularDrag(400);
        this.ship.setMaxVelocity(600);
 
        // add booster to the ship
        this.boosterEmitter = this.add.particles(['booster']).setDepth(4).createEmitter(this.particleConfig).startFollow(this.ship);

        // add row of enemy ships
        this.enemyRowOne = this.physics.add.group({
            key: 'enemy-ship',
            repeat: 5,
            setXY: {x: 320, y: -100, stepX: 75},
            createCallback: (enemy) => {
                // set a delay at the beginning of the game before enemy starts to follow and fire at ship
                enemy.lastFired = this.time.now - Phaser.Math.Between(6000, 8000); 
                enemy.beginfollowingShip = this.time.now + Phaser.Math.Between(5000, 10000); 
            },
        });

        // add row of enemy ships
        this.enemyRowTwo = this.physics.add.group({
            key: 'enemy-ship',
            repeat: 5,
            setXY: {x: 300, y: -50, stepX: 75},
            createCallback: (enemy) => {
                // set a delay at the beginning of the game before enemy starts to follow and fire at ship
                enemy.lastFired = this.time.now - Phaser.Math.Between(5000, 7000); 
                enemy.beginfollowingShip = this.time.now + Phaser.Math.Between(4000, 8000);
            },
        });

        // set enemy ship size and angle
        this.enemyRowOne.children.iterate((enemy) => {
            enemy.setScale(0.6);
            enemy.setAngle(90);
        });

        // set enemy ship size and angle
         this.enemyRowTwo.children.iterate((enemy) => {
            enemy.setScale(0.6);
            enemy.setAngle(90);
        });

         // create enemy bullet group
         this.enemyBullets = this.physics.add.group({
            classType: EnemyBullet,
            maxSize: -1,
            runChildUpdate: true
        });

        // create bullet group
        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: -1,
            runChildUpdate: true
        });

        // add score text
        this.scoreText = this.add.text(80,  30, 'Score: ' + this.score, {font: '25px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        this.scoreText.setScrollFactor(0);

        // add level text
        this.levelText = this.add.text(730,  30, 'Level 3', {font: '25px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        this.levelText.setScrollFactor(0);

        // add ammo display
        this.dipplayAmmo = this.add.text(650,  560, 'Bullets: ' + this.playerAmmo, {font: '25px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        this.dipplayAmmo.setScrollFactor(0);

        // control firing of bullets
        this.fireBullet = true;

        // add level completed text and set to hidden (until level is complete)
        this.gameWonText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2.5, 'Level Three Complete!', { font: '60px Orbitron', stroke: 'black', strokeThickness: 2 }).setOrigin(0.5);
        this.gameWonText.setVisible(false).setScrollFactor(0);

        // // add paused text and set to hidden (until game is paused)
        gamePausedText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Game Paused', { font: '50px Orbitron', stroke: 'black', strokeThickness: 2 }).setOrigin(0.5);
        gamePausedText.setVisible(false).setScrollFactor(0);

         //add game over text and set to hidden (until game is over)
        this.gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2.5, 'Game Over!', { font: '60px Orbitron', stroke: 'black', strokeThickness: 2 }).setOrigin(0.5);
        this.gameOverText.setVisible(false).setScrollFactor(0);

        // follow ship as it travels space
        this.cameras.main.startFollow(this.ship);

        // controls
        this.controls = this.input.keyboard.createCursorKeys();
        this.escape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // set collision detection between ships and bullets
        this.physics.add.collider(this.ship, this.enemyRowOne);
        this.physics.add.collider(this.ship, this.enemyRowTwo);
        this.physics.add.overlap(this.bullets, this.enemyRowOne, this.bulletEnemyCollision, null, this);
        this.physics.add.overlap(this.bullets, this.enemyRowTwo, this.bulletEnemyCollision, null, this);
        this.physics.add.overlap(this.enemyBullets, this.ship, this.enemyBulletShipCollision, null, this);

        // create particle emitter for an explosion to occur when an enemy ship is hit
        this.explosionEmitter = this.add.particles('explosion').createEmitter({
            x: 0,
            y: 0,
            speed: { min: -50, max: 50 },
            scale: { start: 0.5, end: 0 },
            lifespan: 600,
            blendMode: 'ADD',
            on: false 
        });

        // create particle emitter for a shield to display when ship is hit by enemy bullet
        this.shieldEmitter = this.add.particles('circle').createEmitter({
            x: 0,
            y: 0,
            speed: { min: -50, max: 50 },
            scale: { start: 0.4, end: 0 },
            lifespan: 300,
            blendMode: 'ADD',
            on: false 
        });

    
        this.createAsteroid();

        // controls
        this.controls = this.input.keyboard.createCursorKeys();

    }

    update() {

        // apply the control keys
        if (this.controls.left.isDown) {
            this.ship.setAngularVelocity(-150);
        } else if (this.controls.right.isDown) {
            this.ship.setAngularVelocity(150);
        } else {
           this.ship.setAngularVelocity(0);
        }

        // apply booster 
        if (this.controls.up.isDown) {
            this.physics.velocityFromRotation(this.ship.rotation, 400, this.ship.body.acceleration);
            this.boosterEmitter.start();
        } else {
           this.ship.setAcceleration(0);
           this.boosterEmitter.stop();
        }
    
        // utilise bullets if there are bullets remaining
        if (this.controls.space.isDown && this.playerAmmo > 0 && this.fireBullet) {

            const bullet = this.bullets.get();

            if (bullet) {
                
                bullet.fire(this.ship);
                // reduced ammo
                this.playerAmmo--;
                // update ammo display text
                this.dipplayAmmo.setText('Bullets: ' + this.playerAmmo);

                this.fireBullet = false;
                
                // Add a delay to control the firing rate
                this.time.delayedCall(300, () => {
                    this.fireBullet = true;
                });
            }
        } 

        // return to main menu
        if (this.escape.isDown) {
            this.scene.start('MainMenu');
        }

        // update enemy ships to follow and fire at player ship
        this.enemyRowOne.children.iterate((enemy) => {
            // follow and fire at ship
            this.targetShip(enemy);
            
        });

        this.enemyRowTwo.children.iterate((enemy) => {
            // follow and fire at ship
            this.targetShip(enemy);
        });

        // check if all enemy ships destroyed
        if (this.score >= 'enemy-ship'.length + 2) {
            // display game won text
            this.gameWonText.setVisible(true);
            // move on to next level after a delay of 5 seconds
            this.time.delayedCall(5000, () => {
                this.scene.start('LevelThree');
            });
        }

        // this.updateProtectionlevel();

         // use the stars to make it look like the ship is moving fast
        this.stars.tilePositionX += this.ship.body.deltaX() * 2;
        this.stars.tilePositionY += this.ship.body.deltaY() * 2;

    }

    // function to display protection level using coloured squares
    updateProtectionlevel() {
        
        // hide all squares to begin with
        this.redSquare.forEach(square => square.setVisible(false)); 
        this.yellowSquare.forEach(square => square.setVisible(false));
        this.greenSquare.forEach(square => square.setVisible(false));
        
        // display green squares based on protection level - low risk
        for (let i = 0; i < 4 && i < this.protectionLevel - 6; i++) {
            this.greenSquare[i].setVisible(true);
        }
        // display yellow squares based on protection level - medium risk
        for (let i = 0; i < 4 && i < this.protectionLevel - 3; i++) {
            this.yellowSquare[i].setVisible(true);
        }
        // display yellow squares based on protection level - high risk
        for (let i = 0; i < 4 && i < this.protectionLevel; i++) {
            this.redSquare[i].setVisible(true);
        }

    }

    // function to handle collision between ship and enemy bullets
    enemyBulletShipCollision(ship, enemyBullet) {
        enemyBullet.destroy();
        this.shieldEmitter.setPosition(ship.x, ship.y);
        this.shieldEmitter.explode();

        // add hit variable to keep track of number of time ship has been hit by bullet
        if (!this.hits) {
            this.hits = 1;
        } else {
            this.hits++;
        }

        // for every two hits, reduce protection level by one
        if (this.hits % 2 === 0 && this.protectionLevel > 0) {
            this.protectionLevel--;
            this.updateProtectionlevel();
        }

        // player loses if protection level is 0
        if (this.protectionLevel === 0) {
            this.ship.setActive(false);
            this.ship.setVisible(false);
            this.explosionEmitter.setPosition(ship.x, ship.y);
            this.explosionEmitter.explode();

            // display game over text
            this.gameOverText.setVisible(true);

            // go to main menu
            this.time.delayedCall(3000, () => {
                this.scene.start('MainMenu');
            });
        }
    }

    // function to handle collision between enemy ship and bullet as well as update score
    bulletEnemyCollision(bullet, enemy) {
       
        bullet.destroy();
        enemy.destroy();
        
        // update score and amend text
        this.score +=1;
        this.scoreText.setText('Score: ' + this.score);

        // set position of explosion emitter to that of enemey ship's
        this.explosionEmitter.setPosition(enemy.x, enemy.y);
        // start explosion emitter
        this.explosionEmitter.explode();
    }

    // function to handle enemy targeting ship
    targetShip(enemy) {
    
        // check ship still alive
        if (this.ship && this.ship.active) {
            // set enemy ships to follow player ship
            if (this.time.now >= enemy.beginfollowingShip) {

                // adjust angle for pointing at ship
                const angleToPlayer = Phaser.Math.Angle.
                Between(enemy.x, enemy.y, this.ship.x, this.ship.y);
                enemy.rotation = angleToPlayer;
            
                // follow enemy ship
                this.physics.velocityFromRotation(angleToPlayer, 400, enemy.body.velocity);

                // set up enemy to fire
                if (!enemy.lastFired || this.time.now - enemy.lastFired > 1500) {
                    const enemyBullet = this.enemyBullets.get();
                    if (enemyBullet) {
                        enemyBullet.fire(enemy);
                        enemy.lastFired = this.time.now;
                        
                    }
                }
            }
        } 
    }

     // create asteroid
     createAsteroid() {

        const numOfAsteroids = 10;

        for (let i = 0; i < numOfAsteroids; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width); // Random X position
            const y = Phaser.Math.Between(0, this.cameras.main.height); // Random Y position

            // Create an asteroid and add it to the 'asteroids' array
            const asteroid = this.physics.add.image(x, y, 'asteroid').setScale(1.8);
            this.asteroids.push(asteroid);

            // Enable physics for the asteroid
            this.physics.world.enable(asteroid);
            asteroid.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
            this.physics.add.collider(this.ship, asteroid, this.shipAsteroidCollision, null, this);
        }
    }

    // function to update protection level when ship collides with asteroid
    shipAsteroidCollision(asteroid) {
        
        asteroid.setVelocity(0, 0); 
        asteroid.setImmovable(true); 
        this.protectionLevel--;
        this.updateProtectionlevel();
    }
}

// ship bullet class
class Bullet extends Phaser.Physics.Arcade.Image {

    // initialise bullet properties
    constructor(scene, x, y) {

        super(scene, x, y, 'bullet');
        this.setBlendMode(1);
        this.setDepth(1);
        this.speed = 500;
        this.lifespan = 100;

    }

    // initialise firing of the bullet
    fire(ship) {

        this.setActive(true);
        this.setVisible(true);
        this.setAngle(ship.body.rotation);
        this.setPosition(ship.x, ship.y);
        this.body.reset(ship.x, ship.y);
        this.scene.physics.velocityFromRotation(ship.rotation, this.speed, this.body.velocity); 
    }

    // handle bullet lifespan
    preupdate(time, delta) {

        this.lifespan -= delta;

        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
            this.body.stop();
        }
    }

}

// enemy bullet class
class EnemyBullet extends Phaser.Physics.Arcade.Image {

    // initialise bullet properties
    constructor(scene, x, y) {

        super(scene, x, y, 'enemy-bullet');
        this.setBlendMode(1);
        this.setDepth(1);
        this.speed = 600;
        this.lifespan = 80;

    }

    // initialise firing of the bullet
    fire(enemyShip) {

        this.setActive(true);
        this.setVisible(true);
        this.setAngle(enemyShip.body.rotation);
        this.setPosition(enemyShip.x, enemyShip.y);
        this.body.reset(enemyShip.x, enemyShip.y);
        this.scene.physics.velocityFromRotation(enemyShip.rotation, this.speed, this.body.velocity); 
    }

    // handle bullet lifespan
    preupdate(time, delta) {

        this.lifespan -= delta;

        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
            this.body.stop();
        }
    }

}

// variable for when game is paused 
let gamePausedText;

// pause/resume game
document.addEventListener('keydown', (event) => {
    // if the p key is pressed then pause the game and display paused text
    if (event.key === 'p') {
        game.scene.pause('LevelThree');
        gamePausedText.setVisible(true);
    // otherwise if the r key is pressed then resume the game
    } else if (event.key === 'r') {
        game.scene.resume('LevelThree');
        gamePausedText.setVisible(false);
    }
});

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'container',
    transparency: true,
    scene: LevelThree,
    physics: {
        default: 'arcade',
            arcade: {
                debug: false
            }
    }
};

const game = new Phaser.Game(config);

