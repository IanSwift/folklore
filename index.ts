import { CharacterService } from "./CharacterService";
import { Skirmish } from "./skirmish";
import { Readline } from "./Readline";

const characterService = new CharacterService();
const readline = new Readline();
characterService.readline = readline;
characterService.initiateCharacters();
readline.characterService = characterService;


console.log('\n')

let selection = readline.readline("(S)kirmish or (E)ncounter?")

if (selection.toLowerCase()[0] === 's') {
    console.log('\n')
    let skirmish = new Skirmish();
    skirmish.characterService = characterService;
    skirmish.readline = readline;
    skirmish.initiate();
    readline.updateEnemies = skirmish;

    console.log('\n')
    while (!skirmish.round()) {
        console.log('\n')
    }

    console.log("You win!");
}
/*
while(true) {
    let attackType: string = readlinesync.question("(P)layer or (M)onster attack? ");

    if (attackType.substring(0, 1).toLowerCase() === 'p') {
        console.log("Character attack chosen!")
        break;
    } else if (attackType.substring(0,1).toLowerCase() === 'm') {
        console.log("Monster attack chosen!")
        break;
    }
}*/