export class DiceRoller {
    static rollDice(dice: String) {
        let numDice = parseInt(dice.split('d')[0]);
        let dieAmount = parseInt(dice.split('d')[1]);

        let total = 0;
        for (let i = 0; i < numDice; i++) {
            total += Math.floor(Math.random() * dieAmount + 1);
        }
        
        return total;
    }
}