import { Color } from '../enums';

export const HeadingLevel: Partial<Record<Color, number>> = {
  [Color.Title]: 1,
  [Color.Header]: 2,
};
