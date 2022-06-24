import type { FormattedText } from '../text';

export type VersionKey = number;
export type LanguageKey = string;
export type TranslationKey = string;

export type Translation = {
  readonly language: LanguageKey;
  readonly version?: VersionKey;
  readonly key: TranslationKey;
  readonly value: FormattedText | string;
};
