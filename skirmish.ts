import { DiceRoller } from './DiceRoller';
import { SkirmishEnemy } from './EnemyService';
import { ICharacterService } from './ICharacterService';
import { FakeCharacterService } from './FakeCharacterService';
import { IReadline } from './IReadline';
import { FakeReadLine } from './FakeReadLine';
import { IUpdateEnemies } from './IUpdateEnemy';

export class Skirmish implements IUpdateEnemies {
    skirmishEnemies = Array<SkirmishEnemy>();

    public characterService: ICharacterService = new FakeCharacterService();
    public readline: IReadline = new FakeReadLine();

    constructor() { 
    }

    initiate() {
        let numEnemies = this.readline.readlineAsNumber('How many creatures? ')

        for (let i = 0; i < numEnemies; i++) {
            let diceToRoll = this.readline.readline('What dice roll for creature ' + (i+1) + ' strength? ');
            let strength = DiceRoller.rollDice(diceToRoll);
            console.log('Creature ' + (i+1) + ' strength is: ' + strength);
            let might = this.readline.readlineAsNumber('What is creature ' + (i+1) + ' base might (including difficulty bonus)? ');
            let defense = this.readline.readlineAsNumber('What is creature ' + (i+1) + ' base defense (including difficulty bonus)? ');
            this.skirmishEnemies.push(new SkirmishEnemy(i+1, strength, might, defense));
        }
    }

    round() {
        this.characterService.getCharacters().forEach((character) => {
            let attacking = this.readline.readline('Is character ' + character.playerNumber + ' attacking? Y/n')
            character.attacking = attacking.toLowerCase() !== 'n';
            character.target = -1 
            let targets = this.skirmishEnemies.map(enemy=>enemy.enemyNumber);
            console.log("targets: " + targets)
            character.target = this.readline.readlineAsNumber("Which enemy would you like to target? ");
            while(!targets.some(trgt => trgt === character.target)) {
                console.log("Not a valid target.")
                character.target = this.readline.readlineAsNumber("Which enemy would you like to target? ");
            }
        })

        console.log('\n')

        this.skirmishEnemies.forEach(enemy => {
            console.log('Enemy ' + enemy.enemyNumber + ' has strength ' + enemy.strength);
            let mightBonus: number = this.readline.readlineAsNumber('Strength bonus to might? ')
            let enemyAttackRoll = DiceRoller.rollDice('1d100');
            let total = enemyAttackRoll + enemy.might + mightBonus
            console.log('\nEnemy attack of ' + (total));
            console.log('Roll of: ' + enemyAttackRoll + ', might: ' + enemy.might + ', strength bonus ' + mightBonus + '\n');
            let enemyHit = false;
            this.characterService.getCharacters().forEach(character => {
                if (total >= (character.defense + (character.attacking ? 0 : 10))) {
                    console.log('Enemy ' + enemy.enemyNumber + ' hit character ' + character.playerNumber + '!');
                    enemyHit = true;
                }
            })
            if (enemyHit) {
                let diceToRoll = this.readline.readline('What dice roll for creature ' + enemy.enemyNumber + ' ability? ');
                console.log("Enemy " + enemy.enemyNumber+" rolled a " + DiceRoller.rollDice(diceToRoll) + " for their ability!");                
            }
        });

        this.skirmishEnemies.forEach(enemy => {
            console.log('Enemy ' + enemy.enemyNumber + ' has strength ' + enemy.strength);
            let defenseBonus: number = this.readline.readlineAsNumber('Strength bonus to defense? ')
            enemy.defenseBonus = defenseBonus;
            enemy.hits = 0;
        });

        this.characterService.getCharacters().forEach(character => {
            let attackRoll = DiceRoller.rollDice('1d100');
            let total =  attackRoll + character.might + (character.attacking ? 0 : -10)
            console.log("Character " + character.playerNumber + " attack of " + total);
            console.log("Roll of: " + attackRoll + ", might: " + character.might + (character.attacking ? '': ', defending penalty: -10'));
            let target = this.skirmishEnemies.filter(enemy => enemy.enemyNumber === character.target)[0];
            if (attackRoll + character.might + (character.attacking ? 0 : -10) >= target.defense) {
                console.log("Character " + character.playerNumber + " hit enemy " + character.target + "!");
                target.hits += 1
            }
        })      

        this.skirmishEnemies.forEach(enemy => {
            console.log("Enemy " + enemy.enemyNumber + ' took ' + enemy.hits + ' hits.');
            let confirmation = this.readline.readline('Is this correct? (Y/n)');
            if (confirmation.toLowerCase()[0] === 'n') {
                enemy.hits = this.readline.readlineAsNumber('How many hits did they take? ');
            }
            enemy.strength = enemy.strength - enemy.hits;
            if (enemy.strength <= 0) {
                let confirmation = this.readline.readline('Enemy ' + enemy.enemyNumber + ' has been defeated? Remove them from skirmish? (Y/n)');
                if (confirmation.toLowerCase()[0] !== 'n') {
                    this.skirmishEnemies = this.skirmishEnemies.filter(enmy => enmy !== enemy);
                }
            }
        })
        return this.skirmishEnemies.length === 0;

    }

    updateEnemies(): void {
        console.log(this.skirmishEnemies.map(enmy => enmy.enemyNumber).join(", "));
        
        let enemyNumber: number = this.readline.readlineAsNumber("Which creature would you like to update? ")

        while (!this.skirmishEnemies.some(enmy => enmy.enemyNumber === enemyNumber)) {
            console.log("That is not a valid character number.")
            enemyNumber = this.readline.readlineAsNumber("Which creature would you like to update? ")
        }

        let enemyToUpdate = this.skirmishEnemies.filter(enmy=> enmy.enemyNumber === enemyNumber)[0];

        console.log("Updatable fields on enemy " +enemyNumber+ " are: " + Object.keys(enemyToUpdate).join(', '));
        
        let field = this.readline.readline("Which field would you like to update? ");

        while (!Object.keys(enemyToUpdate).some(key => key == field)) {
            console.log("That is not an updatable field.");
            field = this.readline.readline("Which field would you like to update? ");
        }

        let value = this.readline.readlineAsNumber("What value would you like to assign " + field + " on enemy " + enemyNumber+"? ");

        Object.defineProperty(enemyToUpdate, field, {
            value: value,
            writable: true
        });

        console.log(enemyToUpdate);
    }

    
}