import { ICharacterService } from "./ICharacterService";
import { FLCharacter } from "./FL-Character-model";

export class FakeCharacterService implements ICharacterService {
    getCharacters(): FLCharacter[] {
        throw new Error("Method not implemented.");
    }
    updateCharacters() {
        console.log("Create characters to update")
    };
}