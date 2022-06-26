import { fromHtml } from '../../src';

describe('Converting from HTML (e2e)', () => {
  describe('Functions', () => {
    it('should be matched with expected', () => {
      const example = fromHtml(
        'Work with <span data-namespace="From.GetAdjective" /> Allies',
      );
      const result = `Work with [From.GetAdjective] Allies`;
      expect(example.raw).toBe(result);
    });
  });

  describe('Colouring', () => {
    it('should be matched with expected', () => {
      const example = fromHtml(
        'This is my text, <font color="blue" data-color="B">this text is blue</font>, and <font color="red" data-color="R">this text is red</font>',
      );

      const result = `This is my text, §Bthis text is blue§!, and §Rthis text is red§!`;
      expect(example.raw).toBe(result);
    });
  });

  describe('Text Icons', () => {
    it('should be matched with expected', () => {
      const example = fromHtml(
        'Unlocks <img data-name="decision_icon_small" alt="GFX_DECISION_ICON_SMALL" /> decisions',
      );
      const result = `Unlocks £decision_icon_small decisions`;
      expect(example.raw).toBe(result);
    });
  });

  describe('Variables', () => {
    it('should be matched with expected', () => {
      const example = fromHtml(
        '<span data-variable="OWNER|UH" /> has <span data-variable="CURRENT|H0" />/<span data-variable="TOTAL|H0" /> points until being able to become <span data-variable="NEXTLEVEL|H" />',
      );
      const result = `$OWNER|UH$ has $CURRENT|H0$/$TOTAL|H0$ points until being able to become $NEXTLEVEL|H$`;
      expect(example.raw).toBe(result);
    });
  });
});
