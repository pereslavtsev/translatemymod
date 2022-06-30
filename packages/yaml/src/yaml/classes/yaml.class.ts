import { text } from '../../text';
import { TranslationMap } from './translation-map.class';
import type { LanguageKey, Translation } from '../types';
import { translationRegexp, languageRegexp } from '../regexp';
import { addBOM, removeBOM } from '../helpers';
import { nanoid } from 'nanoid';
import { ValidationError } from '../errors';

type MergeOptions = {
  parse?: boolean;
};

type YamlOptions = {
  parse?: boolean;
};

export class Yaml extends TranslationMap {
  protected readonly id = nanoid();
  protected readonly debug = this.debug.extend(this.id);

  protected constructor(protected data: string, options: YamlOptions = {}) {
    super();
    const { parse = true } = options;
    this.debug('yaml file has been initialized');
    if (parse) {
      this.parse();
    }
  }

  parse() {
    const translations = this.matchTranslations();
    this.debug(`${translations.length} has been matched`);
    translations.forEach((translation) => this.add(translation));
    this.debug(
      '%d keys has been matched at %d languages:',
      this.size,
      this.languages.length,
      ...this.languages,
    );
    this.debug('Building a cache...');
    this.buildValuesCache();
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

  static from(data: Buffer | string, options?: YamlOptions) {
    return new Yaml(
      Buffer.isBuffer(data) ? removeBOM(data.toString()) : removeBOM(data),
      options,
    );
  }

  get raw() {
    return this.data;
  }

  validate(): boolean {
    const lines = this.data.split('\n');
    return lines.every((line, index) => {
      const number = index + 1;
      if (line.trim() === '') {
        this.debug(`line ${number} is a empty`);
        return true;
      }
      const isLanguageDeclaration = new RegExp(
        languageRegexp().source.replace('\\n', '').concat('\\s*?$'),
      ).test(line);
      if (isLanguageDeclaration) {
        this.debug(`line ${number} is a language declaration`);
        return true;
      }
      const isTranslation = new RegExp(
        translationRegexp()
          .source.replace('\\s*?#+(?<comment>.*)|', '')
          .concat('\\s*?$'),
      ).test(line);
      if (isTranslation) {
        this.debug(`line ${number} is a translation`);
        return true;
      }
      const isComment = /\s*?#+(?<comment>.*)$/.test(line);
      if (isComment) {
        this.debug(`line ${number} is a comment`);
        return true;
      }
      const error = new ValidationError();
      error.name = `Validation Error`;
      error.message = `Invalid YAML syntax at line ${number}:\n${lines
        .slice(number - 2 >= 0 ? number - 2 : 0, 3)
        .map(
          (line, i) =>
            `\t${i + 1} | ${line}${i === number - 1 ? ' <---- !' : ''}`,
        )
        .join('\n')}
      `;
      error.stack = `${error.name}: ${error.message}`;

      throw error;
    });
  }

  merge(yaml: Yaml, options: MergeOptions = {}): Yaml {
    const { parse = true } = options;
    this.data = this.data.concat(yaml.raw);
    if (parse) {
      this.parse();
    }
    return this;
  }

  protected matchTranslations(language?: LanguageKey): Translation[] {
    if (!language) {
      return this.matchLanguages().flatMap(this.matchTranslations.bind(this));
    }

    return [...this.data.matchAll(languageRegexp(language))].flatMap(
      ([, data]) =>
        [...data.matchAll(translationRegexp())]
          .filter(({ groups }) => !!groups['key'])
          .map(({ groups }) => ({
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
