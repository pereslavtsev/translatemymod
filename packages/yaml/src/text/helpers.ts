import { Color } from './enums';
import { load } from 'cheerio';
import { HeadingLevel, HtmlColor } from './consts';

export function namespaceReplacer(_: string, ...args: string[]) {
  const [name] = args;
  return `<span data-namespace="${name}" />`;
}

export function textIconReplacer(_: string, ...args: string[]) {
  const [name] = args;
  return `<img data-name="${name}" alt="GFX_${name.toUpperCase()}" />`;
}

export function colouringReplacer(_: string, ...args: [Color, ...string[]]) {
  const [color, children] = args;
  const content = `<font color="${HtmlColor[color]}">${children}</font>`;
  const $ = load(content, { xmlMode: true });
  switch (color) {
    case Color.Title:
    case Color.Header: {
      $('span')
        .attr('role', 'heading')
        .attr('aria-level', String(HeadingLevel[color]));
      break;
    }
  }

  return $.html();
}
