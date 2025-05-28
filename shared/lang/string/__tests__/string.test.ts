import { trimEmptyLines, removeFirstEmojiFromString, getFirstEmojiFromString, isURL } from '../string';

describe('trimEmptyLines', () => {
  test('should trim empty lines at the beginning and end by default', () => {
    const input = '\n\n  \nHello World\n  \n\n';
    const expected = 'Hello World';
    expect(trimEmptyLines(input)).toBe(expected);
  });

  test('should trim empty lines only at the beginning when end=false', () => {
    const input = '\n\n  \nHello World\n  \n\n';
    const expected = 'Hello World\n  \n\n';
    expect(trimEmptyLines(input, { end: false })).toBe(expected);
  });

  test('should trim empty lines only at the end when start=false', () => {
    const input = '\n\n  \nHello World\n  \n\n';
    const expected = '\n\n  \nHello World';
    expect(trimEmptyLines(input, { start: false })).toBe(expected);
  });

  test('should not trim any empty lines when start=false and end=false', () => {
    const input = '\n\n  \nHello World\n  \n\n';
    expect(trimEmptyLines(input, { start: false, end: false })).toBe(input);
  });

  test('should handle string with no empty lines', () => {
    const input = 'Hello World';
    expect(trimEmptyLines(input)).toBe(input);
  });

  test('should handle string with only empty lines', () => {
    const input = '\n\n  \n\n  \n\n';
    expect(trimEmptyLines(input)).toBe('');
  });
});

describe('removeFirstEmojiFromString', () => {
  test('should remove the first emoji from a string', () => {
    expect(removeFirstEmojiFromString('👋 Hello')).toBe('Hello');
    expect(removeFirstEmojiFromString('👨‍👩‍👧‍👦 Family')).toBe('Family');
  });

  test('should handle string with no emoji', () => {
    expect(removeFirstEmojiFromString('Hello World')).toBe('Hello World');
  });

  test('should handle string with multiple emojis', () => {
    expect(removeFirstEmojiFromString('👋 Hello 🌎')).toBe('Hello 🌎');
  });

  test('should handle string with only emoji', () => {
    expect(removeFirstEmojiFromString('👋')).toBe('');
    expect(removeFirstEmojiFromString('👨‍👩‍👧‍👦')).toBe('');
  });

  test('should handle empty string', () => {
    expect(removeFirstEmojiFromString('')).toBe('');
  });
});

describe('getFirstEmojiFromString', () => {
  test('should get the first emoji from a string', () => {
    expect(getFirstEmojiFromString('👋 Hello')).toBe('👋');
    expect(getFirstEmojiFromString('👨‍👩‍👧‍👦 Family')).toBe('👨‍👩‍👧‍👦');
  });

  test('should return undefined for string with no emoji', () => {
    expect(getFirstEmojiFromString('Hello World')).toBeUndefined();
  });

  test('should handle string with multiple emojis', () => {
    expect(getFirstEmojiFromString('👋 Hello 🌎')).toBe('👋');
  });

  test('should handle string with only emoji', () => {
    expect(getFirstEmojiFromString('👋')).toBe('👋');
    expect(getFirstEmojiFromString('👨‍👩‍👧‍👦')).toBe('👨‍👩‍👧‍👦');
  });

  test('should handle empty string', () => {
    expect(getFirstEmojiFromString('')).toBeUndefined();
  });
});

describe('isURL', () => {
  test('should return true for valid URLs', () => {
    expect(isURL('https://example.com')).toBe(true);
    expect(isURL('http://example.com')).toBe(true);
    expect(isURL('https://example.com/path')).toBe(true);
    expect(isURL('https://example.com/path?query=string')).toBe(true);
    expect(isURL('https://example.com/path#fragment')).toBe(true);
    expect(isURL('https://sub.example.com')).toBe(true);
  });

  test('should return false for invalid URLs', () => {
    expect(isURL('example.com')).toBe(false);
    expect(isURL('www.example.com')).toBe(false);
    expect(isURL('ftp://example.com')).toBe(false);
    expect(isURL('Hello World')).toBe(false);
    expect(isURL('')).toBe(false);
  });

  test('should return false for URLs with spaces', () => {
    expect(isURL('https://example.com/hello world')).toBe(false);
  });
}); 