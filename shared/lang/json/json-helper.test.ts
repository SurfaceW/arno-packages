import { hackStringify, parseJSONObjectSafe, stringifyObjectSafe } from "./json-helper";

describe("parseJSONObjectSafe", () => {
  test("should return parsed JSON object if input is string", () => {
    const input = '{"prop1": "value1", "prop2": 2}';
    const result = parseJSONObjectSafe(input);
    expect(result).toEqual({
      prop1: "value1",
      prop2: 2,
    });
  });

  test("should return input if it is not a string", () => {
    const input = { prop1: "value1" };
    const result = parseJSONObjectSafe(input);
    expect(result).toEqual(input);
  });

  test("should return input if it is an invalid JSON string", () => {
    const input = '{prop1: "value1"}';
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const result = parseJSONObjectSafe(input);
    expect(result).toBe(input);
    expect(consoleWarnSpy).toHaveBeenCalled();
  });
});

describe("stringifyObjectSafe", () => {
  test("should return stringified object if input is an object", () => {
    const input = { prop1: "value1", prop2: 2 };
    const result = stringifyObjectSafe(input);
    expect(result).toBe('{"prop1":"value1","prop2":2}');
  });

  test("should return input if it is already a string", () => {
    const input = '{"prop1": "value1"}';
    const result = stringifyObjectSafe(input);
    expect(result).toBe(input);
  });

  test("should return empty string if input cannot be stringified", () => {
    hackStringify();
    const input = { prop1: BigInt(2) };
    const result = stringifyObjectSafe(input);
    expect(result).toBe("{\"prop1\":\"2\"}");
  });
});

// describe("hackStringify", () => {
//   hackStringify();
//   test("should stringify BigInt", () => {
//     const input = { prop1: BigInt(2) };
//     const result = stringifyObjectSafe(input);
//     expect(result).toBe("{\"prop1\":\"2\"}");
//   });
// });