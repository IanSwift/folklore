import { FLCharacter } from "./FL-Character-model";

export interface ICharacterService{
    getCharacters(): FLCharacter[];

    updateCharacters(): void;
}