export class Random {
    static between(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static pick<T>(array: T[]) {
        return array[this.between(0, array.length - 1)];
    }

    static flip() {
        return this.between(0, 1) == 0;
    }
}