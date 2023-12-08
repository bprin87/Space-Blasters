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
        const { width, height } = this.scale.gameSize;

        // Menu Background
        const background = this.add.image(0, 0, 'menu-background');
        background.setOrigin(0, 0);

        this.add.image(width * 0.1, height * 0.1, 'planet');
        this.add.image(width * 0.3, height * 0.3, 'player');

        // Menu Text
        const screenCenterX = width / 2;
        const screenCenterY = height / 2;

        // Title
        this.add.text(screenCenterX - 40, screenCenterY - height * 0.4, 'Space', { font: '80px Orbitron', stroke: 'black', strokeThickness: 2 }).setOrigin(0.5);
        this.add.text(screenCenterX + 100, screenCenterY - height * 0.32, 'Blasters', { font: '80px Orbitron', stroke: 'black', strokeThickness: 2 }).setOrigin(0.5);

        // Menu Options
        const playGameText = this.add.text(screenCenterX, screenCenterY - 10, 'Play Game', { font: '35px Orbitron', stroke: 'black', strokeThickness: 2 }).setOrigin(0.5);
        const gameRulesText = this.add.text(screenCenterX, screenCenterY + 80, 'Game Rules', { font: '35px Orbitron', stroke: 'black', strokeThickness: 2 }).setOrigin(0.5);

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
    width: '100%', // Set width to 100% of the parent container
    height: '100%', // Set height to 100% of the parent container
    parent: 'container',
    scene: MainMenu,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
};

const game = new Phaser.Game(config);
