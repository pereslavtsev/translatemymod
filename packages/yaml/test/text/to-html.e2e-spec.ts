import { text } from '../../src';

describe('Converting to HTML (e2e)', () => {
  describe('Functions', () => {
    it('should be matched with expected', () => {
      const example = text(`Work with [From.GetAdjective] Allies`);
      const result =
        'Work with <span data-namespace="From.GetAdjective" /> Allies';
      expect(example.html()).toBe(result);
    });
  });

  describe('Colouring', () => {
    it('should be matched with expected', () => {
      const example = text(
        `This is my text, §Bthis text is blue§!, and §Rthis text is red§!`,
      );
      const result =
        'This is my text, <font color="blue" data-color="B">this text is blue</font>, and <font color="red" data-color="R">this text is red</font>';
      expect(example.html()).toBe(result);
    });
  });

  describe('Text Icons', () => {
    it('should be matched with expected', () => {
      const example = text(`Unlocks £decision_icon_small decisions`);
      const result =
        'Unlocks <img data-name="decision_icon_small" alt="GFX_DECISION_ICON_SMALL" /> decisions';
      expect(example.html()).toBe(result);
    });
  });

  describe('Variables', () => {
    it('should be matched with expected', () => {
      const example = text(
        `$OWNER|UH$ has $CURRENT|H0$/$TOTAL|H0$ points until being able to become $NEXTLEVEL|H$`,
      );
      const result =
        '<span data-variable="OWNER|UH" /> has <span data-variable="CURRENT|H0" />/<span data-variable="TOTAL|H0" /> points until being able to become <span data-variable="NEXTLEVEL|H" />';
      expect(example.html()).toBe(result);
    });
  });
});
