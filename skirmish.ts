import { CharacterService } from './CharacterService';
import readlinesync = require('readline-sync');
import { DiceRoller } from './DiceRoller';
import { FLCharacter } from './FL-Character-model';
import { SkirmishEnemy } from './EnemyService';
import { ICharacterService } from './ICharacterService';
import { FakeCharacterService } from './FakeCharacterService';

export class Skirmish {
    skirmishEnemies = Array<SkirmishEnemy>();

    public characterService: ICharacterService = new FakeCharacterService();

    constructor() { 
    }

    initiate() {
        let numEnemies = readlinesync.question('How many creatures? ')

        for (let i = 0; i < numEnemies; i++) {
            let diceToRoll = readlinesync.question('What dice roll for creature ' + (i+1) + ' strength? ');
            let strength = DiceRoller.rollDice(diceToRoll);
            console.log('Creature ' + (i+1) + ' strength is: ' + strength);
            let might = readlinesync.question('What is creature ' + (i+1) + ' base might (including difficulty bonus)? ');
            let defense = readlinesync.question('What is creature ' + (i+1) + ' base defense (including difficulty bonus)? ');
            this.skirmishEnemies.push(new SkirmishEnemy(i+1, strength, might, defense));
        }
    }

    round() {
        this.characterService.getCharacters().forEach((character) => {
            let attacking = readlinesync.question('Is character ' + character.playerNumber + ' attacking? Y/n')
            character.attacking = attacking.toLowerCase() !== 'n';
            character.target = -1 
            let targets = this.skirmishEnemies.map(enemy=>enemy.enemyNumber);
            console.log("targets: " + targets)
            character.target = readlinesync.question("Which enemy would you like to target? ");
            while(!targets.some(trgt => trgt == character.target)) {
                console.log("Not a valid target.")
                character.target = readlinesync.question("Which enemy would you like to target? ");
            }
        })

        console.log('\n')

        this.skirmishEnemies.forEach(enemy => {
            console.log('Enemy ' + enemy.enemyNumber + ' has strength ' + enemy.strength);
            let mightBonus: number = readlinesync.question('Strength bonus to might? ')
            let enemyAttackRoll = DiceRoller.rollDice('1d100');
            let total = enemyAttackRoll + enemy.might + mightBonus
            console.log('\nEnemy attack of ' + (total));
            console.log('Roll of: ' + enemyAttackRoll + ', might: ' + enemy.might + ', strength bonus ' + mightBonus + '\n');
            let enemyHit = false;
            this.characterService.getCharacters().forEach(character => {
                if (total >= character.defense + (character.attacking ? 0 : 10)) {
                    console.log('Enemy ' + enemy.enemyNumber + ' hit character ' + character.playerNumber + '!');
                    enemyHit = true;
                }
            })
            if (enemyHit) {
                let diceToRoll = readlinesync.question('What dice roll for creature ' + enemy.enemyNumber + ' ability? ');
                let strength = DiceRoller.rollDice(diceToRoll);
                
            }
        });

        console.log('\n');

        this.skirmishEnemies.forEach(enemy => {
            console.log('Enemy ' + enemy.enemyNumber + ' has strength ' + enemy.strength);
            let defenseBonus: number = readlinesync.question('Strength bonus to defense? ')
            enemy.defenseBonus = defenseBonus;
            enemy.hits = 0;
        });

        console.log('\n')
        
        this.characterService.getCharacters().forEach(character => {
            let attackRoll = DiceRoller.rollDice('1d100');
            console.log("Character " + character.playerNumber + " attack of " + attackRoll + character.might + (character.attacking ? 0 : -10));
            console.log("Roll of: " + attackRoll + ", might: " + character.might + character.attacking ? '': ', defending penalty: -10');
            let target = this.skirmishEnemies.filter(enemy => enemy.enemyNumber === character.target)[0];
            if (attackRoll + character.might + (character.attacking ? 0 : -10) >= target.defense) {
                console.log("Character " + character.playerNumber + " hit enemy " + character.target + "!");
                target.hits += 1
            }
        })

        console.log('\n')

        this.skirmishEnemies.forEach(enemy => {
            console.log("Enemy " + enemy.enemyNumber + ' took ' + enemy.hits + ' hits.');
            let confirmation = readlinesync.question('Is this correct? (Y/n)');
            if (confirmation.toLowerCase()[0] === 'n') {
                enemy.hits = readlinesync.question('How many hits did they take? ');
            }
            enemy.strength = enemy.strength - enemy.hits;
            if (enemy.strength <= 0) {
                let confirmation = readlinesync.question('Enemy ' + enemy.enemyNumber + ' has been defeated? Remove them from skirmish? (Y/n)');
                if (confirmation.toLowerCase()[0] !== 'n') {
                    this.skirmishEnemies = this.skirmishEnemies.filter(enmy => enmy != enemy);
                }
            }
        })
        return this.skirmishEnemies.length === 0;

    }

    
}