/**
 * @jest-environment jsdom
 */

import { htmlToTextContent } from './html.helper';

describe('htmlToTextContent', () => {
  // Basic functionality tests
  describe('Basic HTML to text conversion', () => {
    test('should convert simple HTML to text', () => {
      const html = '<p>Hello World</p>';
      const result = htmlToTextContent(html);
      expect(result).toBe('Hello World');
    });

    test('should handle multiple HTML elements', () => {
      const html = '<div><h1>Title</h1><p>Paragraph</p></div>';
      const result = htmlToTextContent(html);
      expect(result).toBe('TitleParagraph');
    });

    test('should handle nested HTML elements', () => {
      const html = '<div><span>Hello <strong>bold</strong> world</span></div>';
      const result = htmlToTextContent(html);
      expect(result).toBe('Hello bold world');
    });

    test('should handle HTML with line breaks and spacing', () => {
      const html = '<p>Line 1</p>\n<p>Line 2</p>';
      const result = htmlToTextContent(html);
      expect(result).toBe('Line 1\nLine 2');
    });

    test('should handle HTML entities', () => {
      const html = '<p>&lt;Hello&gt; &amp; &quot;World&quot;</p>';
      const result = htmlToTextContent(html);
      expect(result).toBe('<Hello> & "World"');
    });
  });

  // Edge cases
  describe('Edge cases', () => {
    test('should handle empty string', () => {
      const result = htmlToTextContent('');
      expect(result).toBe('');
    });

    test('should handle whitespace-only string', () => {
      const result = htmlToTextContent('   \n\t   ');
      expect(result).toBe('');
    });

    test('should handle plain text without HTML tags', () => {
      const html = 'Just plain text';
      const result = htmlToTextContent(html);
      expect(result).toBe('Just plain text');
    });

    test('should handle HTML with only whitespace content', () => {
      const html = '<p>   </p><div>\n\t</div>';
      const result = htmlToTextContent(html);
      expect(result).toBe('');
    });

    test('should handle self-closing tags', () => {
      const html = '<p>Before<br/>After</p>';
      const result = htmlToTextContent(html);
      expect(result).toBe('BeforeAfter');
    });

    test('should handle HTML comments', () => {
      const html = '<p>Text<!-- This is a comment --></p>';
      const result = htmlToTextContent(html);
      expect(result).toBe('Text');
    });

    test('should handle script and style tags', () => {
      const html = '<div>Visible<script>alert("hidden")</script><style>body{color:red}</style>Text</div>';
      const result = htmlToTextContent(html);
      // Note: In jsdom, script and style content is included in textContent
      expect(result).toBe('Visiblealert("hidden")body{color:red}Text');
    });
  });

  // Complex HTML structures
  describe('Complex HTML structures', () => {
    test('should handle tables', () => {
      const html = `
        <table>
          <tr><td>Cell 1</td><td>Cell 2</td></tr>
          <tr><td>Cell 3</td><td>Cell 4</td></tr>
        </table>
      `;
      const result = htmlToTextContent(html);
      // Note: textContent preserves whitespace from the HTML structure
      expect(result).toBe('Cell 1Cell 2\n          Cell 3Cell 4');
    });

    test('should handle lists', () => {
      const html = `
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      `;
      const result = htmlToTextContent(html);
      // Note: textContent preserves whitespace from the HTML structure
      expect(result).toBe('Item 1\n          Item 2\n          Item 3');
    });

    test('should handle forms', () => {
      const html = `
        <form>
          <label>Name:</label>
          <input type="text" value="John" />
          <button>Submit</button>
        </form>
      `;
      const result = htmlToTextContent(html);
      // Note: textContent preserves whitespace and input values are not included
      expect(result).toBe('Name:\n          \n          Submit');
    });
  });

  // Error handling tests
  describe('Error handling', () => {
    test('should throw error for non-string input', () => {
      expect(() => htmlToTextContent(null as unknown as string)).toThrow('Input must be a string');
      expect(() => htmlToTextContent(undefined as unknown as string)).toThrow('Input must be a string');
      expect(() => htmlToTextContent(123 as unknown as string)).toThrow('Input must be a string');
      expect(() => htmlToTextContent({} as unknown as string)).toThrow('Input must be a string');
      expect(() => htmlToTextContent([] as unknown as string)).toThrow('Input must be a string');
    });

    test('should handle malformed HTML gracefully', () => {
      const malformedHtml = '<p>Unclosed paragraph<div>Nested without closing';
      const result = htmlToTextContent(malformedHtml);
      expect(result).toBe('Unclosed paragraphNested without closing');
    });

    test('should handle HTML with invalid characters', () => {
      const html = '<p>Text with \0 null character</p>';
      const result = htmlToTextContent(html);
      // Note: The null character is converted to a space by the DOM
      expect(result).toBe('Text with  null character');
    });
  });

  // Performance and security tests
  describe('Performance and security', () => {
    test('should handle large HTML strings', () => {
      const largeHtml = '<div>' + 'A'.repeat(10000) + '</div>';
      const result = htmlToTextContent(largeHtml);
      expect(result).toBe('A'.repeat(10000));
      expect(result.length).toBe(10000);
    });

    test('should handle deeply nested HTML', () => {
      let nestedHtml = 'Content';
      for (let i = 0; i < 100; i++) {
        nestedHtml = `<div>${nestedHtml}</div>`;
      }
      const result = htmlToTextContent(nestedHtml);
      expect(result).toBe('Content');
    });

    test('should not execute JavaScript in HTML', () => {
      const htmlWithScript = '<div>Safe content<script>window.testVar = "executed"</script></div>';
      const result = htmlToTextContent(htmlWithScript);
      // Note: Script content is included in textContent but not executed
      expect(result).toBe('Safe contentwindow.testVar = "executed"');
      expect((window as unknown as { testVar?: string }).testVar).toBeUndefined();
    });
  });

  // Whitespace handling tests
  describe('Whitespace handling', () => {
    test('should trim leading and trailing whitespace', () => {
      const html = '  <p>  Content  </p>  ';
      const result = htmlToTextContent(html);
      expect(result).toBe('Content');
    });

    test('should preserve internal whitespace', () => {
      const html = '<p>Word1 Word2   Word3</p>';
      const result = htmlToTextContent(html);
      expect(result).toBe('Word1 Word2   Word3');
    });

    test('should handle multiple spaces and tabs', () => {
      const html = '<p>Text\t\twith\n\nmultiple\r\rspaces</p>';
      const result = htmlToTextContent(html);
      // Note: HTML normalizes some whitespace characters to spaces
      expect(result).toBe('Text\t\twith\n\nmultiple\n\nspaces');
    });
  });

  // Special characters and encoding tests
  describe('Special characters and encoding', () => {
    test('should handle Unicode characters', () => {
      const html = '<p>Hello 世界 🌍 café naïve</p>';
      const result = htmlToTextContent(html);
      expect(result).toBe('Hello 世界 🌍 café naïve');
    });

    test('should handle numeric HTML entities', () => {
      const html = '<p>&#8364; &#8482; &#169;</p>';
      const result = htmlToTextContent(html);
      expect(result).toBe('€ ™ ©');
    });

    test('should handle hexadecimal HTML entities', () => {
      const html = '<p>&#x20AC; &#x2122; &#xA9;</p>';
      const result = htmlToTextContent(html);
      expect(result).toBe('€ ™ ©');
    });
  });
}); 