import { IUpdateEnemies } from "./IUpdateEnemy";

export class FakeUpdateEnemies implements IUpdateEnemies {
    updateEnemies(): void {
        console.log("Start a fight to update enemies")
    }
    
}