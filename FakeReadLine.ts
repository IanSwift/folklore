import { IReadline } from "./IReadline";

export class FakeReadLine implements IReadline {
    readlineAsNumber(arg0: string): number {
        throw new Error("Method not implemented.");
    }
    readline(question: String): string {
        throw new Error("Method not implemented.");
    }
}