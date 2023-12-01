class LevelTwo extends Phaser.Scene {

    constructor() {

        super({key: 'levelOne'});

        // add variables
        this.ship;
        this.enemyShip
        this.bullet;
        this.enemyBullet;
        this.controls;
        this.score = 0;
        this.protectionLevel;

        // booster particle config
        this.particleConfig = {
            speed: 100,
            lifespan: {
                onEmit: (particle, key, t, value) => {
                    return Phaser.Math.Percent(this.ship.body.speed, 0, 300) * 2000;
                }
            },
            alpha: {
                onEmit: (particle, key, t, value) =>
                {
                    return Phaser.Math.Percent(this.ship.body.speed, 0, 300);
                }
            },
            angle: {
                onEmit: (particle, key, t, value) =>
                {
                    return (this.ship.angle - 180) + Phaser.Math.Between(-10, 10);
                }
            },
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
        this.load.image('moon6', 'assets/Planets/moon6.png');
        this.load.image('brown-planet', 'assets/Planets/brown-planet.png');
        this.load.image('purple-planet', 'assets/Planets/purple-planet.png');

        // load ships
        this.load.image('ship', 'assets/Player/ship.png');
        this.load.image('enemy-ship', 'assets/Enemy/enemy-ship.png');

        // load objects/FX
        this.load.image('booster', 'assets/Player/booster.png');
        this.load.image('enemy-booster', 'assets/Enemy/booster.png');
        this.load.image('bullet', 'assets/Player/bullet.png');
        this.load.image('enemy-bullet', 'assets/Enemy/enemy-bullet.png');
        this.load.image('explosion', 'assets/FX/flash.png');
        this.load.image('shield', 'assets/Player/')

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
        this.add.image(2000, 700, 'brown-planet').setScale(.5);
        this.add.image(1000, -800, 'purple-planet').setScale(.5);
        this.add.image(800, 1200, 'moon6').setScale(1);
        this.stars = this.add.tileSprite(400, 300, 800, 600, 'stars').setScrollFactor(0);

        // add player ship and set angle
        this.ship = this.physics.add.image(450, 300, 'ship', null).setScale(0.6);
        this.ship.setAngle(-90);

        // control how quickly the ship slows down
        this.ship.setDrag(300);
        this.ship.setAngularDrag(400);
        this.ship.setMaxVelocity(600);
 
        // add booster to the ship
        this.boosterEmitter = this.add.particles(['booster']).setDepth(4).createEmitter(this.particleConfig).startFollow(this.ship);

        // add 2 rows of enemy ships
        this.enemyRowOne = this.physics.add.group({
            collideWorldBounds: true,
            key: 'enemy-ship',
            repeat: 5,
            setXY: {x: 320, y: 100, stepX: 75}
        });

         this.enemyRowTwo = this.physics.add.group({
            collideWorldBounds: true,
            key: 'enemy-ship',
            repeat: 5,
            setXY: {x: 300, y: 50, stepX: 75}
        });

        // set enemy ship size and angle
        this.enemyRowOne.children.iterate((enemy) => {
            enemy.setScale(0.6);
            enemy.setAngle(90);
        });

         this.enemyRowTwo.children.iterate((enemy) => {
            enemy.setScale(0.6);
            enemy.setAngle(90);
        });

        // create bullet group
        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: -1,
            runChildUpdate: true
        });

        // collision detection
        // this.physics.add.overlap

        // add score text
        this.scoreText = this.add.text(80,  30, 'Score: ' + this.score, {font: '25px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        this.scoreText.setScrollFactor(0);

         // add level completed text and set to hidden
         this.gameWonText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2.5, 'Level One Complete!', { font: '60px Orbitron', stroke: 'black', strokeThickness: 2 }).setOrigin(0.5);
         this.gameWonText.setVisible(false).setScrollFactor(0);

        // follow ship as it travels space
        this.cameras.main.startFollow(this.ship);

        // controls
        this.controls = this.input.keyboard.createCursorKeys();

        // set collision detection between ships and bullets
        this.physics.add.collider(this.ship, this.enemyRowOne, this.shipEnemyCollision);
        this.physics.add.collider(this.ship, this.enemyRowTwo, this.shipEnemyCollision);

        this.physics.add.collider(this.bullets, this.enemyRowOne, this.bulletEnemyCollision, null, this);
        this.physics.add.collider(this.bullets, this.enemyRowTwo, this.bulletEnemyCollision, null, this);

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
         
    }

    update() {

        // use the stars to make it look like the ship is moving fast
        this.stars.tilePositionX += this.ship.body.deltaX() * 2;
        this.stars.tilePositionY += this.ship.body.deltaY() * 2;

        // apply the control keys
        if (this.controls.left.isDown) {
            this.ship.setAngularVelocity(-150);
        } else if (this.controls.right.isDown) {
            this.ship.setAngularVelocity(150);
        } else {
           this.ship.setAngularVelocity(0);
        }

        if (this.controls.up.isDown) {
            this.physics.velocityFromRotation(this.ship.rotation, 400, this.ship.body.acceleration);
        } else {
           this.ship.setAcceleration(0);
        }

        // utilise bullets
        if (this.controls.space.isDown) {
            const bullet = this.bullets.get();
            if (bullet) {
                bullet.fire(this.ship);
            }
        }

        // check if all enemy ships destroyed
        if (this.score >= 'enemy-ship'.length + 2) {
            // display game won text
            this.gameWonText.setVisible(true);
            // move on to next level after a delay of 5 seconds
            // this.time.delayedCall(5000, () => {
            //     this.scene.start('levelTwo');
            // });
            
        }
    }

    // function to handle collisions and score update
    bulletEnemyCollision(bullet, enemy) {
        bullet.destroy();
        enemy.destroy();
        this.score +=1;
        this.scoreText.setText('Score: ' + this.score);

        // set position of explosion emitter to that of enemey ship's
        this.explosionEmitter.setPosition(enemy.x, enemy.y);
        // start explosion emitter
        this.explosionEmitter.explode();
    }

}

class Bullet extends Phaser.Physics.Arcade.Image {

    constructor(scene, x, y) {

        super(scene, x, y, 'bullet');

        this.setBlendMode(1);
        this.setDepth(1);

        this.speed = 800;
        this.lifespan = 100;

    }

    fire(ship) {

        this.setActive(true);
        this.setVisible(true);
        this.setAngle(ship.body.rotation);
        this.setPosition(ship.x, ship.y);
        this.body.reset(ship.x, ship.y);

        this.scene.physics.velocityFromRotation(ship.rotation, this.speed, this.body.velocity);
        
    }

    preupdate(time, delta) {

        this.lifespan -= delta;

        if (this.lifespan <= 0)
        {
            this.setActive(false);
            this.setVisible(false);
            this.body.stop();
        }
    }

}


// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'container',
    transparency: true,
    scene: LevelTwo,
    physics: {
        default: 'arcade',
            arcade: {
                debug: false,
            }
    }
};

const game = new Phaser.Game(config); 
