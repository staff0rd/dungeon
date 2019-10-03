export function overlap(from: number, to: number, lower: number, upper: number) {
    return from < upper && lower < to;
}
