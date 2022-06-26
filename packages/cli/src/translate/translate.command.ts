import { Command, CommandRunner, Option } from 'nest-commander';
import * as fg from 'fast-glob';
import { Yaml, fromHtml } from 'hoi4-yaml';
import * as fs from 'fs';
import { TranslationServiceClient } from '@google-cloud/translate';
import { Listr } from 'listr2';
import * as path from 'path';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const translationClient = new TranslationServiceClient();

interface TranslateCommandOptions {
  modPath?: string;
  boolean?: boolean;
  number?: number;
}

type Ctx = Record<
  string,
  {
    translated: number;
    skipped: number;
    buffer?: Buffer;
    yaml?: Yaml;
  }
>;

const KR_PATH =
  '/Volumes/Windows/Users/pstra/Documents/Paradox Interactive/Hearts of Iron IV/mod/1521695605_kaiserreich';

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
    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    const target = 'ru';
    //const modPath2 = KR_PATH;
    //const modPath2 = '../../examples';
    const modPath2 = '../../examples2';

    const tasks = new Listr<Ctx>([], {
      concurrent: 5,
      rendererOptions: {
        showSubtasks: false,
      },
    });

    const stream = fg.stream(['**/*.yml'], {
      cwd: modPath2,
    });

    for await (const entry of stream) {
      tasks.add({
        title: `${entry}`,
        task: (ctx, task) =>
          task.newListr((parent) => [
            {
              task: async () => {
                parent.title = `${entry} (reading...)`;
                ctx[entry.toString()] = { translated: 0, skipped: 0 };
                const filePath = path.join(modPath2, entry.toString());
                ctx[entry.toString()].buffer = await fs.promises.readFile(
                  filePath,
                );
              },
            },
            {
              task: (ctx, task) => {
                parent.title = `${entry} (parsing YAML...)`;
                ctx[entry.toString()].yaml = Yaml.from(
                  ctx[entry.toString()].buffer,
                );
                task.title = `A YAML has been successfully parsed (${
                  ctx[entry.toString()].yaml.size
                } translations)`;
              },
            },
            {
              title: 'Translation to <RUS>...',
              task: (ctx, task) =>
                task.newListr(
                  [...ctx[entry.toString()].yaml.entries()].map(
                    ([key, languageMap]) => ({
                      title: key,
                      task: (ctx, task) =>
                        task.newListr(
                          [
                            ...(languageMap.get('english')?.entries() ?? []),
                          ].map(([version, value]) => ({
                            task: async () => {
                              const markup = value.html();
                              if (markup === '') {
                                ctx[entry.toString()].skipped++;
                                task.skip('Skipped an empty string');
                                return;
                              }
                              const [{ translations }] =
                                await translationClient.translateText({
                                  parent: `projects/kr-atlas/locations/global`,
                                  contents: [markup],
                                  mimeType: 'text/html',
                                  sourceLanguageCode: 'en',
                                  targetLanguageCode: 'ru',
                                });
                              const yaml = ctx[entry.toString()].yaml;
                              yaml.set({
                                language: 'english',
                                version,
                                key,
                                value: fromHtml(translations[0].translatedText),
                              });
                              const translated = ctx[entry.toString()]
                                .translated++;
                              const checked =
                                translated + ctx[entry.toString()].skipped;
                              const percentage = Math.round(
                                (checked / yaml.size) * 100,
                              );
                              parent.title = `${entry} (translating: ${percentage}%)`;
                            },
                          })),
                        ),
                    }),
                  ),
                ),
            },
            {
              task: async (ctx, task) => {
                parent.title = `${entry} (writing a file...)`;
                const filePath = path.join('../../generated', entry.toString());
                const dirName = path.dirname(filePath);
                if (!fs.existsSync(dirName)) {
                  await fs.promises.mkdir(dirName, { recursive: true });
                }
                await fs.promises.writeFile(
                  filePath,
                  ctx[entry.toString()].yaml.toString(),
                );
                task.title = 'File has been successfully written';
                parent.title = `${entry} (translated: ${
                  ctx[entry.toString()].translated
                }, skipped: ${ctx[entry.toString()].skipped})`;
              },
            },
          ]),
      });
    }

    try {
      await tasks.run();
    } catch (e) {
      console.error(e);
    }
  }

  @Option({
    flags: '--mod <mod>',
    description: 'A mod path',
  })
  parseModPath(val: string) {
    return val;
  }
}
