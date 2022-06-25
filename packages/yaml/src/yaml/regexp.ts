import { LanguageKey, TranslationKey, VersionKey } from './types';

const FLAGS = 'gmi';

const LANGUAGE_REGEXP = new RegExp(/^\s*?l_(?<lang>\S+):\n/, FLAGS);
const TRANSLATION_REGEXP = new RegExp(
  /\s*?(?<key>\S+):(?<version>\d+)?\s+"(?<value>.+)"\s*?\n?/,
  FLAGS,
);

export function languageRegexp(language?: LanguageKey): RegExp {
  if (!language) {
    return LANGUAGE_REGEXP;
  }
  return new RegExp(`^l_${language}:\n((.+\n?)+)`, FLAGS);
}

export function translationRegexp(
  key?: TranslationKey,
  version: VersionKey = 0,
): RegExp {
  if (!key && !version) {
    return TRANSLATION_REGEXP;
  }
  return new RegExp(
    `\\s*?(?<key>${key}):(?<version>${version})?\\s+"(?<value>.+)"\\s*?\\n?`,
    FLAGS,
  );
}
