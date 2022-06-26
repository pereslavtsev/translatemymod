import { fromHtml } from '../../src';
import {
  HTML_EXAMPLE,
  FUNCTIONS_EXAMPLE,
  COLOURING_EXAMPLE,
  TEXT_ICONS_EXAMPLE,
  VARIABLES_EXAMPLE,
} from './examples';

describe('Converting from HTML (e2e)', () => {
  it('should return empty string', () => {
    const example = fromHtml('');
    expect(example.raw).toBe('');
  });

  describe('Functions', () => {
    it('should be matched with expected', () => {
      const example = fromHtml(HTML_EXAMPLE[FUNCTIONS_EXAMPLE]);
      expect(example.raw).toBe(FUNCTIONS_EXAMPLE);
    });
  });

  describe('Colouring', () => {
    it('should be matched with expected', () => {
      const example = fromHtml(HTML_EXAMPLE[COLOURING_EXAMPLE]);
      expect(example.raw).toBe(COLOURING_EXAMPLE);
    });
  });

  describe('Text Icons', () => {
    it('should be matched with expected', () => {
      const example = fromHtml(HTML_EXAMPLE[TEXT_ICONS_EXAMPLE]);
      expect(example.raw).toBe(TEXT_ICONS_EXAMPLE);
    });
  });

  describe('Variables', () => {
    it('should be matched with expected', () => {
      const example = fromHtml(HTML_EXAMPLE[VARIABLES_EXAMPLE]);
      expect(example.raw).toBe(VARIABLES_EXAMPLE);
    });
  });
});
