export default class MainMenu extends Phaser.Scene {

    constructor() {

        super({key: 'MainMenu'});

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
        const gameRulesText = this.add.text(screenCenterX, screenCenterY + 80, 'Game Rules', {font: '35px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        
        // Choose Option
        playGameText.setInteractive({useHandCursor: true});
        playGameText.on('pointerdown', () => {
            this.scene.start('DifficultyMode');
        });

        gameRulesText.setInteractive({useHandCursor: true});
        gameRulesText.on('pointerdown', () => {
            this.scene.start('GameRules');
        }); 
    }
}
 
