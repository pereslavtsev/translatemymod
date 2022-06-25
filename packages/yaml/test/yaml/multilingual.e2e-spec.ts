import { Yaml } from '../../src';
import { readExampleFile } from './helpers';
import { LanguageKey } from '../../src/yaml/types';

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
});
