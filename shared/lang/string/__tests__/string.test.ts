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

  // Enhanced test cases
  test('should handle mixed line endings (CRLF, LF)', () => {
    const input = '\r\n\n  \r\nHello World\r\n  \n\r\n';
    const expected = 'Hello World';
    expect(trimEmptyLines(input)).toBe(expected);
  });

  test('should handle tabs and spaces in empty lines', () => {
    const input = '\t\n \t \nHello World\n\t \n \t\n';
    const expected = 'Hello World';
    expect(trimEmptyLines(input)).toBe(expected);
  });

  test('should handle single character content', () => {
    const input = '\n\nA\n\n';
    const expected = 'A';
    expect(trimEmptyLines(input)).toBe(expected);
  });

  test('should handle empty string', () => {
    expect(trimEmptyLines('')).toBe('');
  });

  test('should handle string with only whitespace', () => {
    const input = '   \t   ';
    expect(trimEmptyLines(input)).toBe(input); // Should not trim non-newline whitespace
  });

  test('should preserve internal empty lines', () => {
    const input = '\n\nHello\n\n\nWorld\n\n';
    const expected = 'Hello\n\n\nWorld';
    expect(trimEmptyLines(input)).toBe(expected);
  });

  test('should handle undefined options', () => {
    const input = '\n\nHello World\n\n';
    expect(trimEmptyLines(input, undefined)).toBe('Hello World');
  });

  test('should handle partial options', () => {
    const input = '\n\nHello World\n\n';
    expect(trimEmptyLines(input, { start: true })).toBe('Hello World'); // end defaults to true
    expect(trimEmptyLines(input, { end: true })).toBe('Hello World'); // start defaults to true
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

  // Enhanced test cases
  test('should handle emoji with skin tone modifiers', () => {
    expect(removeFirstEmojiFromString('👋🏻 Hello')).toBe('Hello');
    expect(removeFirstEmojiFromString('👨🏾‍💻 Developer')).toBe('Developer');
  });

  test('should handle emoji with variation selectors', () => {
    expect(removeFirstEmojiFromString('❤️ Love')).toBe('Love');
    expect(removeFirstEmojiFromString('⭐️ Star')).toBe('Star');
  });

  test('should handle complex emoji sequences', () => {
    expect(removeFirstEmojiFromString('👨‍👩‍👧‍👦 Family')).toBe('Family');
    expect(removeFirstEmojiFromString('🏳️‍🌈 Pride')).toBe('Pride');
    expect(removeFirstEmojiFromString('👨‍🚀 Astronaut')).toBe('Astronaut');
  });

  test('should handle emoji at different positions', () => {
    expect(removeFirstEmojiFromString('Hello 👋 World')).toBe('Hello  World');
    expect(removeFirstEmojiFromString('👋Hello World')).toBe('Hello World');
  });

  test('should handle consecutive emojis', () => {
    expect(removeFirstEmojiFromString('👋🌎 Hello World')).toBe('🌎 Hello World');
    expect(removeFirstEmojiFromString('🎉🎊🎈 Party')).toBe('🎊🎈 Party');
  });

  test('should handle string with only whitespace and emoji', () => {
    expect(removeFirstEmojiFromString('   👋   ')).toBe('');
    expect(removeFirstEmojiFromString('\t👋\n')).toBe('');
  });

  test('should handle numbers and special characters that might look like emojis', () => {
    expect(removeFirstEmojiFromString('123 Hello')).toBe('123 Hello');
    expect(removeFirstEmojiFromString('© Copyright')).toBe('© Copyright'); // Copyright symbol is not treated as emoji
  });

  test('should handle unicode characters that are not emojis', () => {
    expect(removeFirstEmojiFromString('α β γ Hello')).toBe('α β γ Hello');
    expect(removeFirstEmojiFromString('中文 Hello')).toBe('中文 Hello');
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

  // Enhanced test cases
  test('should handle emoji with skin tone modifiers', () => {
    expect(getFirstEmojiFromString('👋🏻 Hello')).toBe('👋🏻');
    expect(getFirstEmojiFromString('👨🏾‍💻 Developer')).toBe('👨🏾‍💻');
  });

  test('should handle emoji with variation selectors', () => {
    expect(getFirstEmojiFromString('❤️ Love')).toBe('❤️');
    expect(getFirstEmojiFromString('⭐️ Star')).toBe('⭐️');
  });

  test('should handle complex emoji sequences', () => {
    expect(getFirstEmojiFromString('👨‍👩‍👧‍👦 Family')).toBe('👨‍👩‍👧‍👦');
    expect(getFirstEmojiFromString('🏳️‍🌈 Pride')).toBe('🏳️‍🌈');
    expect(getFirstEmojiFromString('👨‍🚀 Astronaut')).toBe('👨‍🚀');
  });

  test('should handle emoji at different positions', () => {
    expect(getFirstEmojiFromString('Hello 👋 World')).toBe('👋');
    expect(getFirstEmojiFromString('👋Hello World')).toBe('👋');
  });

  test('should handle consecutive emojis', () => {
    expect(getFirstEmojiFromString('👋🌎 Hello World')).toBe('👋');
    expect(getFirstEmojiFromString('🎉🎊🎈 Party')).toBe('🎉');
  });

  test('should handle string with only whitespace and emoji', () => {
    expect(getFirstEmojiFromString('   👋   ')).toBe('👋');
    expect(getFirstEmojiFromString('\t👋\n')).toBe('👋');
  });

  test('should handle numbers and special characters that might look like emojis', () => {
    expect(getFirstEmojiFromString('123 Hello')).toBeUndefined();
    expect(getFirstEmojiFromString('© Copyright')).toBeUndefined(); // Copyright symbol is not treated as emoji
  });

  test('should handle unicode characters that are not emojis', () => {
    expect(getFirstEmojiFromString('α β γ Hello')).toBeUndefined();
    expect(getFirstEmojiFromString('中文 Hello')).toBeUndefined();
  });

  test('should handle null and undefined inputs gracefully', () => {
    // These will cause TypeScript errors but good to test runtime behavior
    // Testing with type assertion to check runtime behavior
    expect(() => getFirstEmojiFromString(null as unknown as string)).toThrow();
    expect(() => getFirstEmojiFromString(undefined as unknown as string)).toThrow();
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

  // Enhanced test cases
  test('should handle URLs with ports', () => {
    expect(isURL('https://example.com:8080')).toBe(true);
    expect(isURL('http://localhost:3000')).toBe(true);
    expect(isURL('https://example.com:8080/path')).toBe(true);
  });

  test('should handle URLs with IP addresses', () => {
    expect(isURL('https://192.168.1.1')).toBe(true);
    expect(isURL('http://127.0.0.1:8080')).toBe(true);
    expect(isURL('https://[::1]:8080')).toBe(false); // IPv6 - current regex doesn't support
  });

  test('should handle URLs with complex paths', () => {
    expect(isURL('https://example.com/path/to/resource')).toBe(true);
    expect(isURL('https://example.com/path-with-dashes')).toBe(true);
    expect(isURL('https://example.com/path_with_underscores')).toBe(true);
    expect(isURL('https://example.com/path/with/numbers123')).toBe(true);
  });

  test('should handle URLs with query parameters', () => {
    expect(isURL('https://example.com?param=value')).toBe(true);
    expect(isURL('https://example.com?param1=value1&param2=value2')).toBe(true);
    expect(isURL('https://example.com/path?param=value&other=123')).toBe(true);
  });

  test('should handle URLs with fragments', () => {
    expect(isURL('https://example.com#section')).toBe(true);
    expect(isURL('https://example.com/path#section')).toBe(true);
    expect(isURL('https://example.com?param=value#section')).toBe(true);
  });

  test('should handle URLs with special characters', () => {
    expect(isURL('https://example.com/path%20with%20spaces')).toBe(true);
    expect(isURL('https://example.com/path?param=value%20with%20spaces')).toBe(true);
    expect(isURL('https://example.com/path-with-special-chars!')).toBe(true);
  });

  test('should reject malformed URLs', () => {
    expect(isURL('https://')).toBe(false);
    expect(isURL('https://.')).toBe(false);
    expect(isURL('https://.com')).toBe(false);
    expect(isURL('https://example.')).toBe(false);
    expect(isURL('https://example..com')).toBe(false);
  });

  test('should reject URLs with unsupported protocols', () => {
    expect(isURL('ftp://example.com')).toBe(false);
    expect(isURL('mailto:user@example.com')).toBe(false);
    expect(isURL('file:///path/to/file')).toBe(false);
    expect(isURL('ws://example.com')).toBe(false);
  });

  test('should handle edge cases', () => {
    expect(isURL('https://a.b')).toBe(true); // Minimal valid URL
    expect(isURL('https://example.com/')).toBe(true); // Trailing slash
    expect(isURL('https://example.com//')).toBe(true); // Double slash in path
  });

  test('should handle null and undefined inputs gracefully', () => {
    // These will cause TypeScript errors but good to test runtime behavior
    // Testing with type assertion to check runtime behavior
    expect(isURL(null as unknown as string)).toBe(false);
    expect(isURL(undefined as unknown as string)).toBe(false);
  });

  test('should handle very long URLs', () => {
    const longPath = 'a'.repeat(1000);
    expect(isURL(`https://example.com/${longPath}`)).toBe(true);
  });

  test('should handle URLs with international domain names', () => {
    // Current regex might not handle these properly
    expect(isURL('https://例え.テスト')).toBe(false); // Japanese domain
    expect(isURL('https://xn--r8jz45g.xn--zckzah')).toBe(true); // Punycode equivalent
  });
});

// Additional test suite for potential bug scenarios
describe('String utilities - Bug scenarios', () => {
  describe('trimEmptyLines - Potential bugs', () => {
    test('BUG: Regex might not handle all whitespace characters correctly', () => {
      // Test with various unicode whitespace characters
      const input = '\u00A0\n\u2000\u2001\u2002\nHello\n\u2003\u2004\n\u00A0';
      const result = trimEmptyLines(input);
      // The current regex might not catch all these unicode spaces
      console.log('Unicode whitespace test result:', JSON.stringify(result));
    });

    test('BUG: Might not handle carriage return without line feed', () => {
      const input = '\rHello\r';
      const result = trimEmptyLines(input);
      // Current regex looks for [\r\n] but might not handle standalone \r properly
      expect(result).toBe('Hello'); // This might fail
    });
  });

  describe('Emoji functions - Potential bugs', () => {
    test('BUG: Emoji regex might not handle all emoji categories', () => {
      // Test with various emoji categories that might not be covered
      const testEmojis = [
        '🔢', // Symbol
        '⚡', // Miscellaneous Symbols
        '🅰️', // Enclosed characters
        '🈲', // Enclosed Ideographic Supplement
        '🀄', // Mahjong tiles
        '🃏', // Playing cards
        '#️⃣', // Keycap sequence
        '🏴󠁧󠁢󠁥󠁮󠁧󠁿', // Flag sequence (England)
      ];

      testEmojis.forEach(emoji => {
        const testString = `${emoji} Test`;
        const extracted = getFirstEmojiFromString(testString);
        const removed = removeFirstEmojiFromString(testString);
        console.log(`Emoji: ${emoji}, Extracted: ${extracted}, Removed: ${removed}`);
      });
    });

    test('BUG: Might not handle emoji at string boundaries correctly', () => {
      // Test emoji at very beginning and end without spaces
      expect(getFirstEmojiFromString('👋Hello')).toBe('👋');
      expect(removeFirstEmojiFromString('👋Hello')).toBe('Hello');
      expect(getFirstEmojiFromString('Hello👋')).toBe('👋');
    });
  });

  describe('isURL - Potential bugs', () => {
    test('BUG: Regex might be too restrictive for valid URLs', () => {
      // Test URLs that should be valid but might be rejected
      const potentiallyValidUrls = [
        'https://example.com:8080/path?param=value#fragment',
        'https://sub.domain.example.com/very/long/path/with/many/segments',
        'https://example.com/path-with-dashes_and_underscores',
        'https://192.168.1.1:3000/api/v1/users',
        'https://example.com/path?param1=value1&param2=value2&param3=value3',
      ];

      potentiallyValidUrls.forEach(url => {
        const result = isURL(url);
        console.log(`URL: ${url}, Valid: ${result}`);
        if (!result) {
          console.warn(`Potentially valid URL rejected: ${url}`);
        }
      });
    });

    test('BUG: Regex might accept invalid URLs', () => {
      // Test URLs that should be invalid but might be accepted
      const potentiallyInvalidUrls = [
        'https://example.com/path with spaces',
        'https://example.com/path\nwith\nnewlines',
        'https://example.com/path\twith\ttabs',
        'https://example.com/path<>with<>brackets',
        'https://example.com/path"with"quotes',
      ];

      potentiallyInvalidUrls.forEach(url => {
        const result = isURL(url);
        console.log(`URL: ${url}, Valid: ${result}`);
        if (result) {
          console.warn(`Potentially invalid URL accepted: ${url}`);
        }
      });
    });
  });
}); 