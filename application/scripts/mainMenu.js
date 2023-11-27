class MainMenu extends Phaser.Scene {

    constructor() {

        super();

        // Class variables
        

    }

    preload() {

        this.load.image('menu-background', 'assets/background3.jpg');
        this.load.image('planet', 'assets/Planets/blue-planet.png');
        this.load.image('player', 'assets/Player/ship.png');
    }

    create() {

        // Menu background
        const background = this.add.image(0, 0, 'menu-background');
        background.setOrigin(0, 0);

        this.add.image(-20, -20, 'planet');
        this.add.image(100, 100, 'player');

        // Menu Text
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2; // centre text
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2; // centre text

        // Title
        this.add.text(screenCenterX - 40, screenCenterY - 240, 'Space', {font: '80px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        this.add.text(screenCenterX + 100, screenCenterY - 160, 'Blasters', {font: '80px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);

        // Menu Options
        const playGameText = this.add.text(screenCenterX, screenCenterY - 10, 'Play Game', {font: '35px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        const gameRules = this.add.text(screenCenterX, screenCenterY + 80, 'Game Rules', {font: '35px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
    

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
    scene: MainMenu,
    physics: {
        default: 'arcade',
            arcade: {
                debug: true
            }
    }
};

const game = new Phaser.Game(config);