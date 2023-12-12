export default class DifficultyMode extends Phaser.Scene {

    constructor() {

        super({key: 'DifficultyMode'});

    }

    preload() {
        this.load.image('menu-background', 'assets/background3.jpg');
        this.load.image('planet', 'assets/Planets/earth.png');  
        this.load.image('moon', 'assets/Planets/brown-planet.png');  
    }

    create() {    
        // Menu Background
        const background = this.add.image(0, 0, 'menu-background');
        background.setOrigin(0, 0);

        this.add.image(750, 600, 'moon').setScale(.25);
        this.add.image(100, 200, 'planet').setScale(.1);

        // Menu Text
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2; // centre text
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2; // centre text

        // Title
        this.add.text(screenCenterX - 40, screenCenterY - 240, 'Space', {font: '80px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        this.add.text(screenCenterX + 100, screenCenterY - 160, 'Blasters', {font: '80px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);

        // Menu Options
        const easyModeText = this.add.text(screenCenterX, screenCenterY - 10, 'Easy Mode', {font: '35px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        const normalModeText = this.add.text(screenCenterX, screenCenterY + 80, 'Normal Mode', {font: '35px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        const hardModeText = this.add.text(screenCenterX, screenCenterY + 170, 'Hard Mode', {font: '35px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        
        // Return to Main Menu
        const returnText = this.add.text(screenCenterX - 350, screenCenterY - 270, 'Back', {font: '25px Orbitron', stroke: 'black', strokeThickness: 2}).setOrigin(.5);
        
        // Choose Option
        easyModeText.setInteractive({useHandCursor: true});
        easyModeText.on('pointerdown', () => {
            this.scene.start('LevelOne');
        });

        normalModeText.setInteractive({useHandCursor: true});
        normalModeText.on('pointerdown', () => {
            this.scene.start('LevelTwo');
        });

        hardModeText.setInteractive({useHandCursor: true});
        hardModeText.on('pointerdown', () => {
            this.scene.start('LevelThree');
        });

        returnText.setInteractive({useHandCursor: true});
        returnText.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}
