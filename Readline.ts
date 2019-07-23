import readlinesync = require('readline-sync');
import { CharacterService } from './CharacterService';
import { EnemyService } from './EnemyService';
import { IReadline } from './IReadline';
import { FakeCharacterService } from './FakeCharacterService';
import { ICharacterService } from './ICharacterService';
import { DiceRoller } from './DiceRoller';

export class Readline implements IReadline {
    readlineAsNumber(question: string): number {
        return parseInt(this.readline(question));
    }

    public characterService: ICharacterService = new FakeCharacterService();
    public enemyService: EnemyService = new EnemyService();

    constructor() {}

    readline(question: string): string {
        let response: string = readlinesync.question(question);
        let responseString = "" + response;
        if (responseString.toLowerCase() === 'update') {
            let updateType = readlinesync.question('What would you like to update? (C)haracters, (E)nemies, or (D)one?' );
            if (updateType.toLowerCase()[0] === 'c') {
                this.characterService.updateCharacters();
                return this.readline(question);
            }
        } else if (response.toLowerCase() === 'rolldice') {
            let dice = readlinesync.question('What dice would you like to roll? ');
            console.log("Result of "+dice+ " was: " + DiceRoller.rollDice(dice));
            return this.readline(question);
        }
        return response;

    }
}