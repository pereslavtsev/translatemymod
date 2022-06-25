import { text, Yaml } from '../../src';
import { readExampleFile } from './helpers';
import { VersionMap } from '../../src/yaml/classes/version-map.class';

const EXAMPLE_LANGUAGE = 'english';
const EXAMPLE_KEY = 'infantry_equipment';
const EXAMPLE_VALUE_1 = text('Infantry Equipment 1').raw;
const EXAMPLE_VALUE_2 = text('Infantry Equipment 2').raw;
const EXAMPLE_VALUE_3 = text('Infantry Equipment 3').raw;

describe('Multi-versional (e2e)', () => {
  let yaml: Yaml;

  beforeAll(async () => {
    const file = await readExampleFile('multi-versional.yml');
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
    it('keys count should be equal 1', () => {
      expect(yaml.size).toBe(1);
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
    let versionsMap: VersionMap;

    beforeAll(() => {
      versionsMap = yaml.get(EXAMPLE_KEY).get(EXAMPLE_LANGUAGE);
    });

    it('versions count should be equal 3', () => {
      expect(versionsMap.size).toBe(3);
    });

    it('should be matched with expected value', () => {
      expect(versionsMap.v(0).raw).toStrictEqual(EXAMPLE_VALUE_1);
    });

    it('should be null', () => {
      expect(versionsMap.v(99)).toBe(null);
    });
  });

  describe('Translations', () => {
    it('should be latest version by default', () => {
      expect(
        yaml.t({ key: 'infantry_equipment', language: 'english' }).raw,
      ).toStrictEqual(EXAMPLE_VALUE_3);
    });

    [EXAMPLE_VALUE_1, EXAMPLE_VALUE_2, EXAMPLE_VALUE_3].forEach((raw, i) => {
      it(`version ${i} should be founded`, () => {
        expect(
          yaml.t({ key: 'infantry_equipment', language: 'english', version: i })
            .raw,
        ).toStrictEqual(raw);
      });
    });
  });

  describe('Editing', () => {
    let edited: Yaml;

    beforeAll(async () => {
      const file = await readExampleFile('multi-versional-edited.yml');
      edited = Yaml.from(file);
    });

    it('data after editing should be matched with expected', () => {
      yaml.set({
        key: EXAMPLE_KEY,
        language: EXAMPLE_LANGUAGE,
        version: 1,
        value: 'Infantry Equipment 2 (edited)',
      });
      expect(yaml.toString()).toBe(edited.toString());
    });
  });
});
