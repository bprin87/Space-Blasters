class LevelOne extends Phaser.Scene {

    constructor() {

        super({key: 'levelOne'});

        // Class Variables

        // Player
        this.playerShip;
        this.boosterEmitter;
        this.controls;
        this.playerShipCollisionCategory
        
        // Bullets
        this.bullet;
        this.nextFire = 0;
        this.bulletCollisionCategory;

        // Enemy
        this.enemy;
        this.enemies = [];
        this.enemyBullet;
        this.enemyCollisionCategory

        // Scores
        this.score = 0;
        this.scoreText;
        this.protectionLevel;

        // Booster Particle Config
        this.particleConfig = {
            speed: {
                onEmit: (particle, key, t, value) => this.playerShip.body.speed / 1,
            },
            lifespan: {
                onEmit: (particle, key, t, value) => Phaser.Math.Percent(this.playerShip.body.speed, 0, 100) * 4000
            },
            blendMode: 'SCREEN',
            emitZone: {type: 'line', source: new Phaser.Geom.Line(300, 300, 80, 80)},
            scale: {start: 0.001, end: 0.5},
        };
        
    }

    preload() {

        this.load.image('game-background', 'assets/background.jpg');
        this.load.image('stars', 'assets/Planets/stars.png');
        this.load.image('ship', 'assets/Player/ship.png');
        this.load.image('booster', 'assets/Player/booster.png');
        this.load.image('bullet', 'assets/Player/bullet.png');
        this.load.image('enemy-ship', 'assets/Enemy/enemy-ship.png');
        this.load.image('sun', 'assets/Planets/sun.png');
        this.load.image('earth', 'assets/Planets/earth.png');
        this.load.image('moon', 'assets/Planets/moon.png');
        this.load.image('moon1', 'assets/Planets/moon1.png');
        this.load.image('moon6', 'assets/Planets/moon6.png');
        this.load.image('brown-planet', 'assets/Planets/brown-planet.png');
        this.load.image('purple-planet', 'assets/Planets/purple-planet.png');
        this.load.image('enemy-ship', 'assets/Enemy/enemy-ship.png');
    }

    create() {

        // Add Background
        const space = this.add.image(0, 0, 'game-background').setScrollFactor(0);
        space.setOrigin(0, 0);

        // Add Planets
        this.add.image(750, 40, 'sun').setScale(.3);
        this.add.image(-250, 300, 'earth').setScale(1);
        this.add.image(950, 800, 'moon').setScale(1);
        this.add.image(-2000, -200, 'moon1').setScale(1.5);
        this.add.image(2000, 700, 'brown-planet').setScale(.5);
        this.add.image(1000, -800, 'purple-planet').setScale(.5);
        this.add.image(800, 1200, 'moon6').setScale(1);
        this.stars = this.add.tileSprite(400, 300, 800, 600, 'stars').setScrollFactor(0);

        // Collision Categories
        this.enemyCollisionCategory = this.matter.world.nextCategory();
        this.bulletCollisionCategory = this.matter.world.nextCategory();
        this.playerShipCollisionCategory = this.matter.world.nextCategory();

        // Player Ship
        this.playerShip = this.matter.add.image(400, 300, 'ship', null);
        this.playerShip.setFrictionAir(0.8);
        this.playerShip.setMass(400);
        this.playerShip.setScale(0.7);
        this.playerShip.setDepth(5);
        this.playerShip.setCollisionCategory(this.playerShipCollisionCategory);

        // Booster 
        this.boosterEmitter = this.add.particles(['booster']).setDepth(4).createEmitter(this.particleConfig).startFollow(this.playerShip);
        
        // Follow Ship
        this.cameras.main.startFollow(this.playerShip);

         // Event to create enemies
         const generateEnemies = this.time.addEvent( {
            delay: 3000,
            callback: createEnemy,
            callbackScope: this,
            loop: false
        });

        // Bullet Handling
        this.bullets = [];

        for (let i = 0; i < 64; i++) {
            this.bullet = new Bullet(this.matter.world, -100, 100, 'bullet', this.wrapBounds);
            this.bullet.setCollisionCategory(this.bulletCollisionCategory);
            this.bullet.setCollidesWith([this.enemyCollisionCategory]);
            this.bullet.setOnCollide(bulletHitsEnemy);
            this.bullets.push(this.bullet);
        }

        // Controls
        this.controls = this.input.keyboard.createCursorKeys();

        // Score
        this.scoreText = this.add.text(80,  30, 'Score: 0 ', {font: '25px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        this.scoreText.setScrollFactor(0);

        // Protection Level
        this.protectionLevelText = this.add.text(200, 560, 'Protection Level', {font: '25px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        this.protectionLevelText.setScrollFactor(0);


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
        }

        // Utilise Bullets
        if (this.controls.space.isDown) {
            var firerate = 400;
            const bullet = this.bullets.find(bullet => !bullet.active);
            if (bullet && this.time.now > this.nextFire) {
                bullet.fire(this.playerShip.x, this.playerShip.y, this.playerShip.rotation, 10);
                this.nextFire = this.time.now + firerate;
            }
        }

         // Utitlise the stars to make it look more like the ship is moving fast
         const speedMultiplier = 2;
         this.stars.tilePositionX += this.playerShip.body.velocity.x * speedMultiplier;
         this.stars.tilePositionY += this.playerShip.body.velocity.y * speedMultiplier;

    }

}

// Enemy Ship Class
class Enemy extends Phaser.Physics.Matter.Sprite {

    constructor(world, x, y, texture, frame, bodyOptions) {

        super(world, x, y, texture, frame, {plugin: bodyOptions});
        this.setFrictionAir(0);
        this.scene.add.existing(this);
        const angle = Phaser.Math.Between(0, 360);
        const speed = Phaser.Math.FloatBetween(0.5, 4);
        const scale = Phaser.Math.FloatBetween(0.1, 0.2)
        this.setScale(scale);
        this.setMass(100 / scale * 2)
        this.setAngle(angle);
        this.setAngularVelocity(Phaser.Math.FloatBetween(-0.05, 0.05));
        this.setVelocityX(speed * Math.cos(angle));
        this.setVelocityY(speed * Math.sin(angle));
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}

// Create Enemies
function createEnemy() {

    let enemy;
    
    for (let i = 0; i < 10; i++) {
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(0, 600);

        enemy = new Enemy(this.matter.world, x, y, 'enemy-ship', null).setScale(.5).setDepth(4);
        enemy.setCollisionCategory(this.enemyCollisionCategory);
        enemy.setCollidesWith([this.enemyCollisionCategory, this.playerShipCollisionCategory, this.bulletCollisionCategory]);
        this.enemies.push(enemy);
    }

    
}

// Bullet Class
class Bullet extends Phaser.Physics.Matter.Sprite {

    lifespan;

    constructor(world, x, y, texture, bodyOptions) {

        super(world, x, y, texture, null, { plugin: bodyOptions });

        this.setFrictionAir(0);
        this.setFixedRotation();
        this.setActive(false);
        this.scene.add.existing(this);
        this.world.remove(this.body, true);
    }

    fire(x, y, angle, speed) {
        
        this.world.add(this.body);
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setRotation(angle);
        this.setVelocityX(speed * Math.cos(angle));
        this.setVelocityY(speed * Math.sin(angle));
        this.lifespan = 1000;
    }

    preUpdate(time, delta) {
        
        super.preUpdate(time, delta);
        this.lifespan -= delta;

        if (this.lifespan <= 0 || !this.active){ // amended
            this.setActive(false);
            this.setVisible(false);
            this.world.remove(this.body, true);
        }
    }
}

// Function for bullet hitting enemy ship
function bulletHitsEnemy(collisionData) {

    const bullet = collisionData.bodyA.gameObject;
    const enemy = collisionData.bodyB.gameObject;

    bullet.setActive(false);
    bullet.setVisible(false);
    bullet.world.remove(bullet.body, true);

    enemy.setActive(false);
    enemy.setVisible(false);
    enemy.world.remove(enemy.body, true);
   
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
                gravity: {
                    x: 0,
                    y: 0
                }
            }
    }
};

const game = new Phaser.Game(config); 