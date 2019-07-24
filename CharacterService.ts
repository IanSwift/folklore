import { FLCharacter } from "./FL-Character-model";
import { IReadline } from "./IReadline";
import { FakeReadLine } from "./FakeReadLine";
import { ICharacterService } from "./ICharacterService";

export class CharacterService implements ICharacterService {
    getCharacters() {
        return this.characters;
    }
    characters = new Array<FLCharacter>();

    public readline: IReadline = new FakeReadLine();


    constructor() {
    }

    initiateCharacters() {
        let numberCharacters = this.readline.readlineAsNumber('How many characters? ');

        for (let i = 0; i < numberCharacters; i++) {
            let character = new FLCharacter();
            character.might = this.readline.readlineAsNumber('Character ' +(i+1)+ ' might? ');
            character.defense = this.readline.readlineAsNumber('Character ' +(i+1)+ ' defense? ');
            character.playerNumber = i + 1;
            this.characters.push(character);
        }
    }

    updateCharacters() {
        console.log(this.characters.map(c => c.playerNumber).join(", "));
        
        let characterNumber: number = this.readline.readlineAsNumber("Which character would you like to update? ")

        while (!this.characters.some(character => character.playerNumber === characterNumber)) {
            console.log("That is not a valid character number.")
            characterNumber = this.readline.readlineAsNumber("Which character would you like to update? ")
        }

        let characterToUpdate = this.characters.filter(character=> character.playerNumber === characterNumber)[0];

        console.log("Updatable fields on character " +characterNumber+ " are: " + Object.keys(characterToUpdate).join(', '));
        
        let field = this.readline.readline("Which field would you like to update? ");

        while (!Object.keys(characterToUpdate).some(key => key == field)) {
            console.log("That is not an updatable field.");
            field = this.readline.readline("Which field would you like to update? ");
        }

        let value = this.readline.readlineAsNumber("What value would you like to assign " + field + " on character " + characterNumber+"? ");

        Object.defineProperty(characterToUpdate, field, {
            value: value,
            writable: true
        });

        console.log(characterToUpdate);
    }
}

