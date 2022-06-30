import { Yaml } from '../../src';
import { readExampleFile } from './helpers';
import { LanguageKey, Translation } from '../../src/yaml/types';

const RECEIVED_LANGUAGES = ['english', 'french', 'russian'];

describe('Multilingual (e2e)', () => {
  let yaml: Yaml;

  beforeAll(async () => {
    const file = await readExampleFile('multilingual.yml');
    yaml = Yaml.from(file);
  });

  describe('Languages', () => {
    let languages: LanguageKey[] = [];

    beforeAll(() => {
      languages = yaml.languages;
    });

    it(`languages should be: ${RECEIVED_LANGUAGES.join(', ')}`, () => {
      expect(languages.every((lang) => RECEIVED_LANGUAGES.includes(lang))).toBe(
        true,
      );
    });

    it('languages count should be equal 3', () => {
      expect(languages.length).toBe(3);
    });

    it('languages should be unique', () => {
      expect(new Set(languages).size).toBe(languages.length);
    });
  });

  describe('Keys', () => {
    it('french dictionary should have a 5 keys', () => {
      expect(yaml.language('french').size).toBe(5);
    });
  });

  describe('Translations', () => {
    let translations: Translation[];
    let filteredTranslations: Translation[];

    beforeAll(() => {
      translations = yaml.translations();
      filteredTranslations = yaml.translations({ language: 'french' });
    });

    it('count should be equal 11', () => {
      expect(translations.length).toBe(11);
    });

    it('count for french should be equal 5', () => {
      expect(filteredTranslations.length).toBe(5);
    });

    it('every filtered translation should be french', () => {
      expect(
        filteredTranslations.every(({ language }) => language === 'french'),
      ).toBe(true);
    });

    it('should be array of objects', () => {
      expect(
        translations.every((translation) => typeof translation === 'object'),
      ).toBe(true);
    });
  });

  describe('Editing', () => {
    let edited: Yaml;

    beforeAll(async () => {
      const file = await readExampleFile('multilingual-edited.yml');
      edited = Yaml.from(file);
    });

    it('data after editing should be matched with expected', () => {
      yaml.set({
        key: 'some_key_4',
        language: 'french',
        value: 'Infantry Equipment (edited)',
      });
      expect(yaml.toString()).toBe(edited.toString());
    });
  });

  describe('Validating', () => {
    it('should be valid', () => {
      expect(yaml.validate()).toBe(true);
    });
  });

  describe('Language Renaming', () => {
    let renamed: Yaml;

    beforeAll(async () => {
      const file = await readExampleFile('multilingual-renamed.yml');
      renamed = Yaml.from(file);
    });

    it('data after renaming should be matched with expected', () => {
      yaml.renameLanguage('french', 'english');
      expect(yaml.toString()).toBe(renamed.toString());
    });
  });
});
