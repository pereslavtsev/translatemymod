import { Color } from './enums';

const FLAGS = 'gmi';

export const COLOURING_REGEXP = new RegExp(
  `§(${Object.values(Color).join('|')})(.*?)§!`,
  FLAGS,
);

export const NAMESPACE_REGEXP = new RegExp(/\[(.*?)]/, FLAGS);
export const VARIABLE_REGEXP = new RegExp(/\$(.*?)\$/, FLAGS);
export const TEXT_ICON_REGEXP = new RegExp(/£(\S+)/, FLAGS);
