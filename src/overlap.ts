export function overlap(from: number, to: number, lower: number, upper: number) {
    return lower <= to && from <= upper;
}
