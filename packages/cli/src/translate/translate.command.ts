import { Command, CommandRunner, Option } from 'nest-commander';
import * as fg from 'fast-glob';
import { Yaml } from 'hoi4-yaml';
import * as fs from 'fs';
import { Listr } from 'listr2';
import * as path from 'path';

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
  prevOriginalYaml: Yaml;
  prevTranslatedYaml: Yaml;
};

const KR_PATH =
  '/Volumes/Windows/Users/pstra/Documents/Paradox Interactive/Hearts of Iron IV/mod/1521695605_kaiserreich';
const KR_PATH_RUS =
  '/Volumes/Windows/Users/pstra/Documents/Paradox Interactive/Hearts of Iron IV/mod/1151467921_kaiserreich_beta';

@Command({
  name: 'translate',
  arguments: '<path>',
  description: 'A parameter parse',
})
export class TranslateCommand implements CommandRunner {
  @Option({
    flags: '--mod <mod>',
    description: 'A mod path',
  })
  parseModPath(val: string) {
    return val;
  }

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

    const entriesPrev = await fg(['**/*.yml'], {
      cwd: KR_PATH,
      absolute: true,
    });

    const entriesPrevTranslated = await fg(['**/*.yml'], {
      cwd: KR_PATH_RUS,
      absolute: true,
    });

    const tasks = new Listr<Ctx1>([], {
      ctx: {
        processed: 0,
        total: entries.length,
        prevOriginalYaml: null,
        prevTranslatedYaml: null,
      },
      rendererOptions: {
        //showSubtasks: false,
      },
    });

    tasks.add({
      title: 'Reading files...',
      task: (ctx, task) =>
        task.newListr((parent) =>
          entriesPrev.concat(...entriesPrevTranslated).map((entry, i) => ({
            task: async (ctx1, task1) => {
              parent.output = `Reading a file ${entry}... (${i} / ${entriesPrev.length})`;
              const buffer = await fs.promises.readFile(entry.toString());
              const yaml = Yaml.from(buffer, { parse: false });
              if (!ctx1.prevOriginalYaml) {
                ctx1.prevOriginalYaml = yaml;
              }
              ctx1.prevOriginalYaml.merge(yaml, { parse: false });
            },
          })),
        ),
    });
    tasks.add({
      title: 'Parsing YAML from previous version...',
      task: (ctx, task) => {
        ctx.prevOriginalYaml.parse();
        const { size: translations, languages } = ctx.prevOriginalYaml;
        const translationsCount = new Intl.NumberFormat().format(translations);
        const languagesCount = new Intl.NumberFormat().format(languages.length);
        task.title = `YAML has been successfully parsed (${translationsCount} translations at ${languagesCount} languages)`;
      },
    });

    tasks.add({
      title: 'Translating...',
      task: async (ctx1, task) =>
        task.newListr((parent) =>
          entries.map((entry) => ({
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
                    // skip: () => true,
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

                              parent.output = `Importing translation ${key} from previous version...`;
                              const [tr] = ctx1.prevOriginalYaml.translations({
                                cacheOnly: true,
                                language: 'english',
                                value:
                                  typeof value === 'string' ? value : value.raw,
                              });
                              if (tr) {
                                const translatedValue = ctx1.prevOriginalYaml.t(
                                  {
                                    key: tr.key,
                                    version: tr.version,
                                    language: 'russian',
                                  },
                                );
                                if (translatedValue) {
                                  ctx.yaml.set({
                                    language: 'english',
                                    key,
                                    value: translatedValue,
                                  });
                                  ctx.skipped++;
                                  task.skip('Skipped a translation');
                                  return;
                                }
                              }
                            },
                          })),
                        {
                          concurrent: 1,
                        },
                      ),
                  },
                  {
                    task: async (ctx, task) => {
                      parent.output = `Writing a file ${entry}...`;
                      ctx.yaml.renameLanguage('english', 'russian');
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
}
