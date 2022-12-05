import { type States, newStates } from "./States";

export function nextStates(states: States): States {
	const size = states.length;
	const get = (row: number, column: number): boolean =>
		0 <= row &&
		row < size &&
		0 <= column &&
		column < size &&
		states[row][column];
	const range = (n: number): number[] => [...Array(n).keys()];
	const countLivings = (row: number, column: number): number => {
		const delta = range(3).map((x) => x - 1);
		let livings = 0;
		for (let rowDelta of delta) {
			for (let columnDelta of delta) {
				if (rowDelta === 0 && columnDelta === 0) {
					continue;
				}
				const r = row + rowDelta;
				const c = column + columnDelta;
				if (get(r, c)) {
					livings++;
				}
			}
		}
		return livings;
	};
	const calcState = (row: number, column: number): boolean => {
		const center = get(row, column);
		const livings = countLivings(row, column);
		return livings === 3 || (center && livings === 2);
	};

	let buf = newStates(size);
	for (let row = 0; row < size; row++) {
		for (let column = 0; column < size; column++) {
			buf[row][column] = calcState(row, column);
		}
	}
	return buf;
}
