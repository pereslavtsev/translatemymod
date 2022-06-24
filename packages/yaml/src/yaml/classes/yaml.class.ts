import { text } from '../../text';
import { TranslationMap } from './translation-map.class';
import type { LanguageKey, Translation } from '../types';
import { translationRegexp, languageRegexp } from '../regexp';

export class Yaml extends TranslationMap {
  protected constructor(protected data: string) {
    super();
    this.add(...this.matchTranslations());
  }

  protected handleChange(event) {
    super.handleChange(event);

    const { key, version, language } = event;
    [...this.data.matchAll(languageRegexp(language))].map(([data]) => {
      console.log(222, translationRegexp(key, version));
      const xxxx = this.data.match(translationRegexp(key, version));
      console.log('xxxx', xxxx);
      data.replace(translationRegexp(key, version), (d) => {
        console.log(d);
        return '';
      });
    });
  }

  static from(data: Buffer | string) {
    return new Yaml(Buffer.isBuffer(data) ? data.toString() : data);
  }

  protected matchTranslations(language?: LanguageKey): Translation[] {
    if (!language) {
      return this.matchLanguages().flatMap(this.matchTranslations.bind(this));
    }

    return [...this.data.matchAll(languageRegexp(language))].flatMap(
      ([, data]) =>
        [...data.matchAll(translationRegexp())].map(({ groups }) => {
          const [key, version] = groups['key'].split(':');
          return {
            language,
            key,
            version: version ? Number(version) : undefined,
            value: text(groups['value']),
          };
        }),
    );
  }

  protected matchLanguages(): LanguageKey[] {
    const languages = [...this.data.matchAll(languageRegexp())].map(
      ({ groups }) => groups['lang'],
    );
    return [...new Set(languages)];
  }
}
