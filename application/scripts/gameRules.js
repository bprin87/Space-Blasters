class GameRules extends Phaser.Scene {

    constructor() {

        super({key: 'gameRules'});

        // Class Variables
        
    }

    preload() {

        this.load.image('menu-background', 'assets/background3.jpg');
        this.load.image('sun', 'assets/Planets/sun.png');
        this.load.image('purple', 'assets/Planets/planet09.png');
    }

    create() {

        // Rules Background
        const rulesBackground = this.add.image(0, 0, 'menu-background');
        rulesBackground.setOrigin(0, 0);

        this.add.image(100, 530, 'sun');
        this.add.image(740, 40, 'purple').setScale(.050);

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2; // centre text
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2; // centre text

        // Return to Main Menu
        this.add.text(screenCenterX - 350, screenCenterY - 270, 'Back', {font: '25px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);

        // Title
        this.add.text(screenCenterX + 10, screenCenterY - 180, 'Game Rules', {font: '50px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);

        // Rules
        this.add.text(screenCenterX, screenCenterY - 80, '1. Use the four arrow keys to move the ship, and the space bar to shoot', {font: '18px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        this.add.text(screenCenterX, screenCenterY - 45, '2. You must destroy all enemy ships to win the game', {font: '18px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        this.add.text(screenCenterX, screenCenterY - 10, '3. Each enemy ship you destroy will earn you one point', {font: '18px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        this.add.text(screenCenterX, screenCenterY + 25, '4. Each time you are hit by the enemy you will lose one level of protection', {font: '18px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        this.add.text(screenCenterX, screenCenterY + 60, '5. If you lose all your protection then you lose the game', {font: '18px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        
    }

    update() {

    }


}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'container',
    transparency: true,
    scene: [GameRules],
    physics: {
        default: 'arcade',
            arcade: {
                debug: true
            }
    }
};

const game = new Phaser.Game(config);