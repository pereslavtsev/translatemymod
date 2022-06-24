import { Color } from './enums';

export const COLOURING_REGEXP = new RegExp(
  `§(${Object.values(Color).join('|')})(.*?)§!`,
  'gm',
);

export const NAMESPACE_REGEXP = /\[(.*?)]/gm;
export const TEXT_ICON_REGEXP = /£(\S+)/gm;
