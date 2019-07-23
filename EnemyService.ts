export class EnemyService {
    skirmishEnemies = new Array<SkirmishEnemy>()
    isSkirmish: boolean = false;

    constructor() {

    }
}


export class SkirmishEnemy {
    defenseBonus: number;
    hits: number;
    constructor(
        public enemyNumber: number, 
        public strength: number, 
        public might: number, 
        public defense: number){}
}