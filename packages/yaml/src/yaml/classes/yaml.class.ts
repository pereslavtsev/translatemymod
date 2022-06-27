import { text } from '../../text';
import { TranslationMap } from './translation-map.class';
import type { LanguageKey, Translation } from '../types';
import { translationRegexp, languageRegexp } from '../regexp';
import { addBOM, removeBOM } from '../helpers';
import { nanoid } from 'nanoid';

export class Yaml extends TranslationMap {
  protected readonly id = nanoid();
  protected readonly debug = this.debug.extend(this.id);

  protected constructor(protected data: string) {
    super();
    this.debug('yaml file has been initialized');
    this.add(...this.matchTranslations());
    this.debug(
      '%d keys has been matched at %d languages:',
      this.size,
      this.languages.length,
      ...this.languages,
    );
  }

  protected handleChange(event) {
    super.handleChange(event);

    const { key, version, language, after } = event;
    const updatedData = this.data.replace(languageRegexp(language), (data) => {
      const regexp = translationRegexp(key, version);
      this.debug('matching translations... %o', { language, regexp });
      return data.replace(regexp, (line, ...args) => {
        const groups = args.find((arg) => typeof arg === 'object');
        const searchValue = `"${groups['value']}"`;
        const replaceValue = `"${after.raw}"`;
        this.debug('trying to replace: %s -> %s', searchValue, replaceValue);
        return line.replace(searchValue, replaceValue);
      });
    });
    if (this.data === updatedData) {
      this.debug('warning: no data updates after change event!');
      return;
    }
    this.data = updatedData;
    this.debug('data has been updated');
  }

  renameLanguage(from: LanguageKey, to: LanguageKey): void {
    super.renameLanguage(from, to);
    const updatedData = this.data.replace(
      languageRegexp(from, false),
      (data, ...args: [LanguageKey, ...string[]]) => {
        const [language] = args;
        return data.replace(language, to);
      },
    );
    if (this.data === updatedData) {
      this.debug('warning: no data updates after renaming event!');
      return;
    }
    this.data = updatedData;
    this.debug('data has been updated');
  }

  static from(data: Buffer | string) {
    return new Yaml(
      Buffer.isBuffer(data) ? removeBOM(data.toString()) : removeBOM(data),
    );
  }

  protected matchTranslations(language?: LanguageKey): Translation[] {
    if (!language) {
      return this.matchLanguages().flatMap(this.matchTranslations.bind(this));
    }

    return [...this.data.matchAll(languageRegexp(language))].flatMap(
      ([, data]) =>
        [...data.matchAll(translationRegexp())].map(({ groups }) => ({
          language,
          key: groups['key'],
          version: groups['version'] ? Number(groups['version']) : undefined,
          value: text(groups['value'] ?? ''),
        })),
    );
  }

  protected matchLanguages(): LanguageKey[] {
    const languages = [...this.data.matchAll(languageRegexp())].map(
      ({ groups }) => groups['lang'],
    );
    this.debug('matched languages', languages);
    return [...new Set(languages)];
  }

  toString() {
    return addBOM(this.data);
  }
}
