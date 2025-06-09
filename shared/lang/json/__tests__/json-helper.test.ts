import { parseJSONObjectSafe, stringifyObjectSafe, safeStringify, enableBigIntStringify } from '../json-helper';

describe('JSON Helper', () => {
  describe('parseJSONObjectSafe', () => {
    it('should parse valid JSON', () => {
      const json = '{"name":"test","value":123}';
      const result = parseJSONObjectSafe(json);
      expect(result).toEqual({ name: 'test', value: 123 });
    });

    it('should return the original string if parsing fails', () => {
      const invalidJson = '{"name":"test",value:123}'; // missing quotes around value
      const result = parseJSONObjectSafe(invalidJson);
      expect(result).toBe(invalidJson);
    });

    it('should return non-string values as is', () => {
      const obj = { name: 'test', value: 123 };
      const result = parseJSONObjectSafe(obj);
      expect(result).toBe(obj);
    });
  });

  describe('stringifyObjectSafe', () => {
    it('should stringify valid objects', () => {
      const obj = { name: 'test', value: 123 };
      const result = stringifyObjectSafe(obj);
      expect(result).toBe('{"name":"test","value":123}');
    });

    it('should return string values as is', () => {
      const str = 'already a string';
      const result = stringifyObjectSafe(str);
      expect(result).toBe(str);
    });

    it('should return empty string if stringify fails', () => {
      // Create an object with circular reference
      const circular: Record<string, unknown> = {};
      circular.self = circular;
      
      const result = stringifyObjectSafe(circular);
      expect(result).toBe('');
    });
  });

  describe('safeStringify', () => {
    it('should stringify objects with BigInt values', () => {
      const obj = { 
        id: BigInt(9007199254740991), 
        name: 'test'
      };
      
      const result = safeStringify(obj);
      expect(result).toBe('{"id":"9007199254740991","name":"test"}');
    });

    it('should handle nested BigInt values', () => {
      const obj = { 
        user: {
          id: BigInt(9007199254740991),
          stats: {
            count: BigInt(42)
          }
        }
      };
      
      const result = safeStringify(obj);
      expect(result).toBe('{"user":{"id":"9007199254740991","stats":{"count":"42"}}}');
    });

    it('should handle BigInt values in arrays', () => {
      const obj = { 
        ids: [BigInt(1), BigInt(2), BigInt(3)]
      };
      
      const result = safeStringify(obj);
      expect(result).toBe('{"ids":["1","2","3"]}');
    });
  });

  describe('enableBigIntStringify', () => {
    const originalStringify = JSON.stringify;
    
    beforeEach(() => {
      // Reset JSON.stringify before each test
      JSON.stringify = originalStringify;
    });
    
    afterAll(() => {
      // Restore original JSON.stringify after all tests
      JSON.stringify = originalStringify;
    });

    it('should patch JSON.stringify to handle BigInt values', () => {
      enableBigIntStringify();
      
      const obj = { id: BigInt(9007199254740991) };
      const result = JSON.stringify(obj);
      
      expect(result).toBe('{"id":"9007199254740991"}');
    });

    it('should work with custom replacer functions', () => {
      enableBigIntStringify();
      
      const obj = { 
        id: BigInt(123),
        secret: 'password' 
      };
      
      // Custom replacer that hides the secret field
      const replacer = (key: string, value: unknown) => {
        if (key === 'secret') return '***';
        return value;
      };
      
      const result = JSON.stringify(obj, replacer);
      expect(result).toBe('{"id":"123","secret":"***"}');
    });

    it('should work with replacer arrays', () => {
      enableBigIntStringify();
      
      const obj = { 
        id: BigInt(123),
        name: 'test',
        secret: 'password' 
      };
      
      // Only include id and name fields
      const result = JSON.stringify(obj, ['id', 'name']);
      expect(result).toBe('{"id":"123","name":"test"}');
    });

    it('should handle indentation', () => {
      enableBigIntStringify();
      
      const obj = { id: BigInt(123) };
      const result = JSON.stringify(obj, null, 2);
      
      expect(result).toBe('{\n  "id": "123"\n}');
    });
  });
}); 