export type States = boolean[][];

export function newStates(n: number): States {
	return Array.from({ length: n }, (_) => new Array(n).fill(false));
}

export function newRandomStates(n: number): States {
	let states = newStates(n);
	for (let row = 0; row < n; row++) {
		for (let column = 0; column < n; column++) {
			states[row][column] = Math.random() < 0.5;
		}
	}
	return states;
}

export function intoString(states: States): string {
	return states
		.flat()
		.map((x) => (x ? "1" : "0"))
		.join("");
}

export class ConversionError extends Error {
	constructor(e?: string) {
		super(e);
		this.name = new.target.name;
	}
}

export class InvalidCharError extends ConversionError {
	constructor(c: string, public index: number, public str: string) {
		super(c);
	}
}

export class InvalidLengthError extends ConversionError {
	constructor(len: number, public str: string) {
		super(len.toString());
	}
}

export function fromString(statesString: string): States {
	for (let i = 0; i < statesString.length; i++) {
		const c = statesString[i];
		if (!"01".includes(c)) {
			throw new InvalidCharError(c, i, statesString);
		}
	}

	const size = Math.sqrt(statesString.length);
	if (!Number.isInteger(size)) {
		throw new InvalidLengthError(size, statesString);
	}

	let states = newStates(size);
	for (let k = 0; k < statesString.length; k++) {
		const i = k % size;
		const j = Math.floor(k / size);
		const c = statesString[k];
		const v = c === "1";
		states[j][i] = v;
	}
	return states;
}
