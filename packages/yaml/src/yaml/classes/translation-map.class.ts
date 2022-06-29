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

type GetTranslationsOptions = Partial<Pick<Translation, 'language'>> & {
  value?: string | RegExp;
  cacheOnly?: boolean;
};

export class TranslationMap extends CaseInsensitiveMap<
  TranslationKey,
  LanguageMap
> {
  translate(options: TranslateOptions): FormattedText | null {
    const { language, version, key } = options;
    return this.get(key)?.get(language)?.v(version) ?? null;
  }

  readonly t = this.translate;
  protected valuesCache: Map<string, Translation[]> = null;

  protected buildValuesCache() {
    const translations = this.translations();

    const valuesCache = new Map<string, Translation[]>();

    translations.forEach((translation) => {
      const { value } = translation;
      const raw = typeof value === 'string' ? value : value.raw;
      if (!valuesCache.has(raw)) {
        valuesCache.set(raw, []);
      }
      valuesCache.get(raw).push(translation);
    });
    this.valuesCache = valuesCache;
  }

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
      case 'object': {
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
        return this;
      }
      default: {
        throw new Error('Incorrect translation type');
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

  renameLanguage(from: LanguageKey, to: LanguageKey): void {
    this.translations({ language: from }).forEach((translation) => {
      const { key } = translation;
      const langMap = this.get(key);
      const langData = langMap.get(from);
      langMap.set(to, langData).delete(from);
    });
  }

  translations(options: GetTranslationsOptions = {}): Translation[] {
    const { language, value, cacheOnly = false } = options;

    if (value && typeof value === 'string' && this.valuesCache.has(value)) {
      return this.valuesCache.get(value).filter((translation) => {
        if (!language) {
          return true;
        }
        return language === translation.language;
      });
    }

    if (cacheOnly) {
      return [];
    }

    return [...this.entries()]
      .map(([key, langMap]) =>
        [...(language ? langMap.language(language) : langMap).entries()].map(
          ([language, versionMap]) =>
            [...(versionMap?.entries() ?? [])]
              .map(([version, value]) => ({
                key,
                language,
                value,
                version,
              }))
              .filter((translation) => {
                if (!value) {
                  return true;
                }
                switch (typeof value) {
                  case 'string': {
                    return translation.value.raw === value;
                  }
                  case 'object': {
                    if (value instanceof RegExp) {
                      // global flag should be removed
                      const flags = value.flags.replace('g', '');
                      return new RegExp(value, flags).test(
                        translation.value.raw,
                      );
                    }
                  }
                }
              }),
        ),
      )
      .flat(3);
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
