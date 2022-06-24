import { text } from '../../src';

describe('HTML', () => {
  describe('Functions', () => {
    it('', () => {
      const example = text(`Work with [From.GetAdjective] Allies`);
      const result =
        'Work with <span data-namespace="From.GetAdjective" /> Allies';
      expect(example.html()).toBe(result);
    });
  });

  describe('Colouring', () => {
    it('', () => {
      const example = text(
        `This is my text, §Bthis text is blue§!, and §Rthis text is red§!`,
      );
      const result =
        'This is my text, <font color="blue">this text is blue</font>, and <font color="red">this text is red</font>';
      expect(example.html()).toBe(result);
    });
  });

  describe('Text Icons', () => {
    it('', () => {
      const example = text(`Unlocks £decision_icon_small decisions`);
      const result =
        'Unlocks <img data-name="decision_icon_small" alt="GFX_DECISION_ICON_SMALL" /> decisions';
      expect(example.html()).toBe(result);
    });
  });
});
