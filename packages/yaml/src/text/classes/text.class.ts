import {
  COLOURING_REGEXP,
  NAMESPACE_REGEXP,
  TEXT_ICON_REGEXP,
  VARIABLE_REGEXP,
} from '../regexp';
import {
  colouringReplacer,
  namespaceReplacer,
  textIconReplacer,
  variableReplacer,
} from '../helpers';
import { load } from 'cheerio';

export class FormattedText {
  protected constructor(readonly raw: string) {}

  static fromText(text: string | FormattedText) {
    if (text instanceof FormattedText) {
      return new FormattedText(text.raw);
    }
    return new FormattedText(text);
  }

  static fromHtml(html: string) {
    const $ = load(html, { xmlMode: true, decodeEntities: false });
    $('[data-namespace]').replaceWith(
      (i, el) => `[${$(el).attr('data-namespace')}]`,
    );
    $('img').replaceWith((i, el) => `£${$(el).attr('data-name')}`);
    $('[data-variable]').replaceWith(
      (i, el) => `$${$(el).attr('data-variable')}$`,
    );
    $('font').replaceWith(
      (i, el) => `§${$(el).attr('data-color')}${$(el).html()}§!`,
    );
    return FormattedText.fromText($.html());
  }

  html() {
    return this.raw
      .replace(COLOURING_REGEXP, colouringReplacer)
      .replace(NAMESPACE_REGEXP, namespaceReplacer)
      .replace(TEXT_ICON_REGEXP, textIconReplacer)
      .replace(VARIABLE_REGEXP, variableReplacer);
  }
}
