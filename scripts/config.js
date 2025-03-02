import MainMenu from './mainMenu.js';
import DifficultyMode from './difficultyMode.js';
import GameRules from './gameRules.js';
import LevelOne from './levelOne.js';
import LevelTwo from './levelTwo.js';
import LevelThree from './levelThree.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'container',
    transparency: true,
    scene: [MainMenu, DifficultyMode, GameRules, LevelOne, LevelTwo, LevelThree],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);