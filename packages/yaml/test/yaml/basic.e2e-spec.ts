import { text, Yaml } from '../../src';
import { readExampleFile } from './helpers';
import { VersionMap } from '../../src/yaml/classes/version-map.class';
import { Translation } from '../../src/yaml/types';
import { before } from 'cheerio/lib/api/manipulation';

const EXAMPLE_LANGUAGE = 'english';
const EXAMPLE_KEY = 'infantry_equipment';
const EXAMPLE_VALUE = text('Infantry Equipment').raw;

describe('Basic (e2e)', () => {
  let yaml: Yaml;

  beforeAll(async () => {
    const file = await readExampleFile('basic.yml');
    yaml = Yaml.from(file);
  });

  describe('Languages', () => {
    it('should have one language only', () => {
      expect(yaml.languages.length).toBe(1);
    });

    it('language should be match with expected', () => {
      expect(yaml.languages[0]).toBe(EXAMPLE_LANGUAGE);
    });
  });

  describe('Keys', () => {
    it('keys count should be equal 3', () => {
      expect(yaml.size).toBe(3);
    });

    it('should have expected key', () => {
      expect(yaml.has(EXAMPLE_KEY)).toBe(true);
    });

    it('item should have expected language', () => {
      expect(yaml.get(EXAMPLE_KEY).has(EXAMPLE_LANGUAGE)).toBe(true);
    });

    it('item should have expected version', () => {
      expect(yaml.get(EXAMPLE_KEY).get(EXAMPLE_LANGUAGE).has(0)).toBe(true);
    });
  });

  describe('Versions', () => {
    let versionMap: VersionMap;

    beforeAll(() => {
      versionMap = yaml.get(EXAMPLE_KEY).get(EXAMPLE_LANGUAGE);
    });

    it('should be matched with expected value', () => {
      expect(versionMap.v(0).raw).toBe(EXAMPLE_VALUE);
    });

    it('should be null', () => {
      expect(versionMap.v(99)).toBe(null);
    });
  });

  describe('Translations', () => {
    let translations: Translation[];

    beforeAll(() => {
      translations = yaml.translations();
    });

    it('count should be equal 3', () => {
      expect(translations.length).toBe(3);
    });

    it('should be array of objects', () => {
      expect(
        translations.every((translation) => typeof translation === 'object'),
      ).toBe(true);
    });

    it('value should be matched with expected', () => {
      const translation = yaml.t({
        key: EXAMPLE_KEY,
        language: EXAMPLE_LANGUAGE,
      });
      expect(translation.raw).toStrictEqual(EXAMPLE_VALUE);
    });

    describe('Translation Search', () => {
      describe('Search by plain text', () => {
        let translations: Translation[];

        beforeAll(() => {
          translations = yaml.translations({
            language: EXAMPLE_LANGUAGE,
            value: EXAMPLE_VALUE,
          });
        });

        it('should have a result', () => {
          expect(translations.length).toBe(1);
        });

        it('should be array of translations', () => {
          expect(
            translations.every(
              (translation) => typeof translation === 'object',
            ),
          ).toBe(true);
        });
      });

      describe('Search by regular expression', () => {
        let translations: Translation[];

        beforeAll(() => {
          translations = yaml.translations({
            language: EXAMPLE_LANGUAGE,
            value: /inf/gim,
          });
        });

        it('should have a results', () => {
          expect(translations.length).toBe(2);
        });

        it('should be array of translations', () => {
          expect(
            translations.every(
              (translation) => typeof translation === 'object',
            ),
          ).toBe(true);
        });
      });
    });
  });

  describe('Editing', () => {
    let edited: Yaml;

    beforeAll(async () => {
      const file = await readExampleFile('basic-edited.yml');
      edited = Yaml.from(file);
    });

    it('data after editing should be matched with expected', () => {
      yaml.set({
        key: EXAMPLE_KEY,
        language: EXAMPLE_LANGUAGE,
        value: 'Infantry Equipment (edited)',
      });
      expect(yaml.toString()).toBe(edited.toString());
    });
  });

  describe('Language Renaming', () => {
    let edited: Yaml;

    beforeAll(async () => {
      const file = await readExampleFile('basic-renamed.yml');
      edited = Yaml.from(file);
    });

    it('data after editing should be matched with expected', () => {
      yaml.renameLanguage('english', 'french');
      expect(yaml.toString()).toBe(edited.toString());
    });
  });
});
