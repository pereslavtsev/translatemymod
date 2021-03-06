import { LanguageKey, TranslationKey, VersionKey } from './types';

const FLAGS = 'gmi';

const LANGUAGE_REGEXP = new RegExp(/^\s*?l_(?<lang>\S+):\r?\n/, FLAGS);
const TRANSLATION_REGEXP = new RegExp(
  /\s*?#+(?<comment>.*)|\s*?(?<key>\S+):(?<version>\d+)?\s+"(?<value>.+)?"\s*?\n?/,
  FLAGS,
);

export function languageRegexp(
  language?: LanguageKey,
  withData = true,
): RegExp {
  if (!language) {
    return LANGUAGE_REGEXP;
  }
  if (!withData) {
    return new RegExp(`^\\s*?l_(?<lang>${language}):\\r?\\n`, FLAGS);
  }
  return new RegExp(
    `^l_${language}:\r?\n((\\s?\\r?\\n|^\\s*?#.*|\\s*?(\\S+):(\\d+)?\\s+"(.+)?"\\s*?\\r?\\n?)+)`,
    FLAGS,
  );
}

export function translationRegexp(
  key?: TranslationKey,
  version: VersionKey = 0,
): RegExp {
  if (!key && !version) {
    return TRANSLATION_REGEXP;
  }
  return new RegExp(
    `\\s*?#+(?<comment>.*)|\\s*?(?<key>${key}):(?<version>${version})?\\s+"(?<value>.+)?"\\s*?\\n?`,
    FLAGS,
  );
}
