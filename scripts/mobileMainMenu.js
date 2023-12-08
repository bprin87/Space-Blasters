class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        this.load.image('menu-background', 'assets/background3.jpg');
        this.load.image('planet', 'assets/Planets/earth.png');
        this.load.image('player', 'assets/Player/ship.png');
    }

    create() {
        // Menu Background
        const background = this.add.image(0, 0, 'menu-background');
        background.setOrigin(0, 0);
        background.setScale(this.cameras.main.width / background.width, this.cameras.main.height / background.height);

        this.add.image(20, 20, 'planet').setScale(0.5);
        this.add.image(100, 100, 'player').setScale(0.5);

        // Menu Text
        const screenCenterX = this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.height / 2;

        // Title
        this.add.text(screenCenterX, screenCenterY - this.cameras.main.height * 0.4, 'Space', {
            font: `${Math.floor(this.cameras.main.height * 0.1)}px Orbitron`,
            stroke: 'black',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.add.text(screenCenterX, screenCenterY - this.cameras.main.height * 0.3, 'Blasters', {
            font: `${Math.floor(this.cameras.main.height * 0.1)}px Orbitron`,
            stroke: 'black',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Menu Options
        const playGameText = this.add.text(screenCenterX, screenCenterY - 10, 'Play Game', {
            font: `${Math.floor(this.cameras.main.height * 0.035)}px Orbitron`,
            stroke: 'black',
            strokeThickness: 2
        }).setOrigin(0.5);

        const gameRulesText = this.add.text(screenCenterX, screenCenterY + 80, 'Game Rules', {
            font: `${Math.floor(this.cameras.main.height * 0.035)}px Orbitron`,
            stroke: 'black',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Choose Option
        playGameText.setInteractive({ useHandCursor: true });
        playGameText.on('pointerdown', () => {
            this.scene.start('levelOne');
        });

        gameRulesText.setInteractive({ useHandCursor: true });
        gameRulesText.on('pointerdown', () => {
            this.scene.start('GameRules');
        });
    }

    update() {}
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
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
