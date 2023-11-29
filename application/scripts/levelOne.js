class LevelOne extends Phaser.Scene {

    constructor() {

        super({key: 'levelOne'});

        // Class Variables

        // Player
        this.playerShip;
        this.bullet;
        this.boosterEmitter;
        this.controls;
        this.shipCollisionCategory
        this.bulletCollisionCategory;
        this.nextFire = 0;

        // Enemy
        this.enemy;
        this.enemyBullet;
        this.enemyCollisionCategory

        // Scores
        this.score;
        this.protectionLevel;

        // Configures the Wrap World Plugin - ship will reappear from oppoiste end when going off screen
        // this.wrapBounds = {
        //     wrap: {
        //         min: {x: 0, y: 0},
        //         max: {x: 800, y: 600}
        //     }
        // }


        // Setup Booster
        this.particleConfig = {
            speed: {
                onEmit: (particle, key, t, value) => this.playerShip.body.speed / 1,
            },
            lifespan: {
                onEmit: (particle, key, t, value) => Phaser.Math.Percent(this.playerShip.body.speed, 0, 100) * 5000
            },
            blendMode: 'SCREEN',
            emitZone: {type: 'line', source: new Phaser.Geom.Line(300, 300, 80, 80)},
            scale: {start: 0.001, end: 0.5},
        };
        
    }

    preload() {

        this.load.image('game-background', 'assets/background.jpg');
        this.load.image('stars', 'assets/Planets/stars.png'); // not used yet
        this.load.image('ship', 'assets/Player/ship.png');
        this.load.image('booster', 'assets/Player/booster.png');
        this.load.image('bullet', 'assets/Player/bullet.png');
        this.load.image('enemy-ship', 'assets/Enemy/enemy-ship.png');
    }

    create() {

        // Add Background
        const space = this.add.image(0, 0, 'game-background');
        space.setOrigin(0, 0);

        // Score
        this.add.text(50,  30, 'Score: ', {font: '20px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);

        // Protection Level
        this.add.text(200, 560, 'Protection Level', {font: '20px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);

        // Collision Categories
        this.asteroidCollisionCategory = this.matter.world.nextCategory();
        this.bulletCollisionCategory = this.matter.world.nextCategory();
        this.shipCollisionCategory = this.matter.world.nextCategory();
        

        // Player Ship
        this.playerShip = this.matter.add.image(400, 300, 'ship', null, {plugin: this.wrapBounds});
        this.playerShip.setFrictionAir(0.8);
        this.playerShip.setMass(400);
        this.playerShip.setScale(0.7);
        this.playerShip.setDepth(5);
        this.playerShip.setCollisionCategory(this.shipCollisionCategory);

        // // Follow Ship
        // this.cameras.main.startFollow(this.playerShip);

        // Booster 
        this.boosterEmitter = this.add.particles(['booster']).setDepth(4).createEmitter(this.particleConfig).startFollow(this.playerShip);

        // Bullet Handling
        this.bullets = [];
        for (let i = 0; i < 64; i++) {
            this.bullet = new Bullet(this.matter.world, -100, 100, 'bullet', this.wrapBounds);
            this.bullet.setCollisionCategory([this.shipCollisionCategory, this.bulletCollisionCategory]); // needs changing one enemy ships are added
            this.bullets.push(this.bullet);
        }
        
        // Controls
        this.controls = this.input.keyboard.createCursorKeys();
    }

    update() {

        // Set up 
        if (this.controls.left.isDown){
            this.playerShip.setAngularVelocity(-0.4);
        } else if (this.controls.right.isDown) {
            this.playerShip.setAngularVelocity(0.4);
        }
    
        // Utilise Booster
        if (this.controls.up.isDown){
            this.playerShip.thrust(2.8);
        } else if (this.controls.up.isDown){
            this.playerShip.thrust(2.2);
        }

        // Bullet
        if (this.controls.space.isDown) {
            var firerate = 400;
            const bullet = this.bullets.find(bullet => !bullet.active);
            if (bullet && this.time.now > this.nextFire) {
                bullet.fire(this.playerShip.x, this.playerShip.y, this.playerShip.rotation, 10);
                this.nextFire = this.time.now + firerate;
            }
        }

    }

}

// Bullet Class
class Bullet extends Phaser.Physics.Matter.Sprite
{
    lifespan;

    constructor(world, x, y, texture, bodyOptions)
    {
        super(world, x, y, texture, null, { plugin: bodyOptions });

        this.setFrictionAir(0);
        this.setFixedRotation();
        this.setActive(false);
        this.scene.add.existing(this);
        this.world.remove(this.body, true);
    }

    fire(x, y, angle, speed)
    {
        
        this.world.add(this.body);

        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.setRotation(angle);
        this.setVelocityX(speed * Math.cos(angle));
        this.setVelocityY(speed * Math.sin(angle));
    

        this.lifespan = 300;
   
    }

    preUpdate(time, delta)
    {
        super.preUpdate(time, delta);

        this.lifespan -= delta;

        if (this.lifespan <= 0)
        {
            this.setActive(false);
            this.setVisible(false);
            this.world.remove(this.body, true);
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
    scene: LevelOne,
    physics: {
        default: 'matter',
            matter: {
                debug: false,
                // used for wrap plugin
                // plugins: {
                //     wrap: true
                // },
                gravity: {
                    x: 0,
                    y: 0
                }
            }
    }
};

const game = new Phaser.Game(config);