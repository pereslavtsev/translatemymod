import { CaseInsensitiveMap } from '../../misc';
import type { LanguageKey, Translation, TranslationKey } from '../types';
import { LanguageMap } from './language-map.class';
import { VersionMap } from './version-map.class';
import { FormattedText, text } from '../../text';

type TranslateOptions = Omit<Translation, 'value' | 'language'> &
  Partial<Pick<Translation, 'language'>>;

type TranslationChangeEvent = Omit<Translation, 'value'> & {
  readonly before: FormattedText;
  readonly after: FormattedText;
  readonly context: TranslationMap;
};

export class TranslationMap extends CaseInsensitiveMap<
  TranslationKey,
  LanguageMap
> {
  translate(options: TranslateOptions) {
    const { language, version, key } = options;
    return this.get(key).get(language).v(version);
  }

  readonly t = this.translate;

  protected handleAdd(translation: Translation) {
    this.debug('translation has been added: %o', translation);
  }

  protected handleChange(event: TranslationChangeEvent) {
    const { context: _, ...payload } = event;
    this.debug('on change trigger has been called: %O', payload);
  }

  set(translation: TranslationKey | Translation, value?: LanguageMap) {
    switch (typeof translation) {
      case 'string': {
        return super.set(translation, value);
      }
      case 'object':
      default: {
        const { key, language, version = 0, value } = translation;
        const before = this.t({ key, version, language });
        const after = this.get(key)
          .get(language)
          .set(version, value)
          .get(version);
        this.handleChange({
          before,
          after,
          context: this,
          key,
          version,
          language,
        });
      }
    }
  }

  get languages(): LanguageKey[] {
    return [
      ...new Set([...this.values()].flatMap(({ languages }) => languages)),
    ];
  }

  language(language: LanguageKey): TranslationMap {
    const entries = [...this.entries()]
      .filter(([, value]) => value.has(language))
      .map<[LanguageKey, LanguageMap]>(([key, value]) => [
        key,
        value.language(language),
      ]);
    return new TranslationMap(entries);
  }

  add(...items: Translation[]) {
    items.forEach((item) => {
      const { language, key, version = 0, value } = item;
      const formattedText = text(value);

      const versionMap = new VersionMap([[version, formattedText]]);
      const languageMap = new LanguageMap([[language, versionMap]]);

      if (!this.has(key)) {
        this.set(key, languageMap);
      } else if (!this.get(key).has(language)) {
        this.get(key).set(language, versionMap);
      } else if (!this.get(key).get(language).has(version)) {
        this.get(key).get(language).set(version, formattedText);
      }

      this.handleAdd(item);
    });
    return this;
  }
}
