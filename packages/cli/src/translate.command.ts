import { Command, CommandRunner, Option } from 'nest-commander';
import * as fg from 'fast-glob';
import { Yaml } from 'hoi4-yaml';
import * as fs from 'fs';
import { TranslationServiceClient } from '@google-cloud/translate';

const translationClient = new TranslationServiceClient();

interface TranslateCommandOptions {
  modPath?: string;
  boolean?: boolean;
  number?: number;
}

@Command({
  name: 'translate',
  arguments: '<path>',
  description: 'A parameter parse',
})
export class TranslateCommand implements CommandRunner {
  async run(
    [modPath]: string[],
    options?: TranslateCommandOptions,
  ): Promise<void> {
    // /**
    //  * TODO(developer): Uncomment the following lines before running the sample.
    //  */
    // const text = 'Hello, world!';
    // const target = 'ru';
    //
    // async function translateText() {
    //   // Translates the text into the target language. "text" can be a string for
    //   // translating a single piece of text, or an array of strings for translating
    //   // multiple texts.
    //   // let [translations] = await translate.translate(text, target);
    //   // translations = Array.isArray(translations)
    //   //   ? translations
    //   //   : [translations];
    //   // console.log('Translations:');
    //   // translations.forEach((translation, i) => {
    //   //   console.log(`${text[i]} => (${target}) ${translation}`);
    //   // });
    // }
    //
    // await translateText();

    // const stream = fg.stream(['**/*.yml'], {
    //   absolute: true,
    //   cwd: '../../examples',
    // });
    //
    // for await (const entry of stream) {
    //   fs.promises
    //     .readFile(entry)
    //     .then((buffer) => Yaml.from(buffer))
    //     .then((yaml) => console.log('yaml', yaml));
    // }
    // console.log('options', modPath, options);
  }

  @Option({
    flags: '--mod <mod>',
    description: 'A mod path',
  })
  parseModPath(val: string) {
    return val;
  }
}
