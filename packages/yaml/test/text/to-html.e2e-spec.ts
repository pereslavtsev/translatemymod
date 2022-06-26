import { text } from '../../src';
import {
  HTML_EXAMPLE,
  FUNCTIONS_EXAMPLE,
  COLOURING_EXAMPLE,
  TEXT_ICONS_EXAMPLE,
  VARIABLES_EXAMPLE,
} from './examples';

describe('Converting to HTML (e2e)', () => {
  it('should return empty string', () => {
    const example = text('');
    expect(example.html()).toBe('');
  });

  describe('Functions', () => {
    it('should be matched with expected', () => {
      const example = text(FUNCTIONS_EXAMPLE);
      expect(example.html()).toBe(HTML_EXAMPLE[FUNCTIONS_EXAMPLE]);
    });
  });

  describe('Colouring', () => {
    it('should be matched with expected', () => {
      const example = text(COLOURING_EXAMPLE);
      expect(example.html()).toBe(HTML_EXAMPLE[COLOURING_EXAMPLE]);
    });
  });

  describe('Text Icons', () => {
    it('should be matched with expected', () => {
      const example = text(TEXT_ICONS_EXAMPLE);
      expect(example.html()).toBe(HTML_EXAMPLE[TEXT_ICONS_EXAMPLE]);
    });
  });

  describe('Variables', () => {
    it('should be matched with expected', () => {
      const example = text(VARIABLES_EXAMPLE);
      expect(example.html()).toBe(HTML_EXAMPLE[VARIABLES_EXAMPLE]);
    });
  });
});
