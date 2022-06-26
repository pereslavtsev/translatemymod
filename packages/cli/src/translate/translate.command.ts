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

type Ctx = {
  translated: number;
  skipped: number;
  buffer?: Buffer;
  yaml?: Yaml;
};

type Ctx1 = {
  processed: number;
  total: number;
};

const KR_PATH =
  '/Volumes/Windows/Users/pstra/Documents/Paradox Interactive/Hearts of Iron IV/mod/1521695605_kaiserreich';

function* chunks(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
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
    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    const target = 'ru';
    //const modPath2 = KR_PATH;
    //const modPath2 = '../../examples';
    const modPath2 = '../../examples2';

    const entries = await fg(['**/*.yml'], {
      cwd: modPath2,
    });

    const tasks = new Listr<Ctx1>([], {
      ctx: {
        processed: 0,
        total: entries.length,
      },
      rendererOptions: {
        showSubtasks: false,
      },
    });

    tasks.add({
      title: 'Translating...',
      task: async (ctx1, task) =>
        task.newListr((parent) =>
          entries.map((entry) => ({
            title: `${entry}`,
            task: (_, task) =>
              task.newListr<Ctx>(
                () => [
                  {
                    task: async (ctx) => {
                      parent.title = `Translating ${entry} (${ctx1.processed}/${ctx1.total})...`;
                      parent.output = `Reading a file ${entry}...`;
                      const filePath = path.join(modPath2, entry.toString());
                      ctx.buffer = await fs.promises.readFile(filePath);
                    },
                  },
                  {
                    task: async (ctx) => {
                      parent.output = `Parsing YAML from ${entry}...`;
                      ctx.yaml = Yaml.from(ctx.buffer);
                    },
                  },
                  {
                    task: (ctx, task) =>
                      task.newListr(
                        ctx.yaml
                          .translations({ language: 'english' })
                          .map(({ key, value, version }) => ({
                            task: async () => {
                              const markup =
                                typeof value === 'string'
                                  ? value
                                  : value.html();
                              if (markup === '') {
                                ctx.skipped++;
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
                              ctx.yaml.set({
                                language: 'english',
                                version,
                                key,
                                value: fromHtml(translations[0].translatedText),
                              });
                              const translated = ctx.translated++;
                              const checked = translated + ctx.skipped;
                              const percentage = Math.round(
                                (checked / ctx.yaml.size) * 100,
                              );
                              parent.output = `Translating ${entry}: ${percentage}% (${checked}/${ctx.yaml.size})`;
                            },
                          })),
                      ),
                  },
                  {
                    task: async (ctx, task) => {
                      parent.output = `Writing a file ${entry}...`;
                      const filePath = path.join(
                        '../../generated',
                        entry.toString(),
                      );
                      const dirName = path.dirname(filePath);
                      if (!fs.existsSync(dirName)) {
                        await fs.promises.mkdir(dirName, { recursive: true });
                      }
                      await fs.promises.writeFile(
                        filePath,
                        ctx.yaml.toString(),
                      );
                      ctx1.processed++;
                      parent.output = `${entry} (translated: ${ctx.translated}, skipped: ${ctx.skipped})`;
                    },
                  },
                ],
                {
                  ctx: {
                    translated: 0,
                    skipped: 0,
                    buffer: null,
                    yaml: null,
                  },
                },
              ),
          })),
        ),
    });

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
