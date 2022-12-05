import * as States from "../States";

describe("fromString", () => {
	it("is an inverse of intoString", () => {
		const input = "0110";
		const got = States.intoString(States.fromString(input));
		expect(got).toEqual(input);
	});

	it("fail when input contains a char except 0 and 1", () => {
		expect(() => States.fromString("a")).toThrow(States.InvalidCharError);
	});

	it("fail when input len is not a square number", () => {
		expect(() => States.fromString("10")).toThrow(States.InvalidLengthError);
	});
});
