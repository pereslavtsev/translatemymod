import { Color } from './enums';
import { load } from 'cheerio';
import { HeadingLevel, HtmlColor } from './consts';

export function namespaceReplacer(_: string, ...args: string[]) {
  const [name] = args;
  return `<span translate="no" data-namespace="${name}" />`;
}

export function textIconReplacer(_: string, ...args: string[]) {
  const [name] = args;
  return `<img translate="no" data-name="${name}" alt="GFX_${name.toUpperCase()}" />`;
}

export function colouringReplacer(_: string, ...args: [Color, ...string[]]) {
  const [color, children] = args;
  const content = `<font translate="no" color="${HtmlColor[color]}" data-color="${color}">${children}</font>`;
  const $ = load(content, { xmlMode: true, decodeEntities: false });
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

export function variableReplacer(_: string, ...args: string[]) {
  const [data] = args;
  return `<span translate="no" data-variable="${data}" />`;
}
