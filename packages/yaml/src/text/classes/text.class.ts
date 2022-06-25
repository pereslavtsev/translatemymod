import {
  COLOURING_REGEXP,
  NAMESPACE_REGEXP,
  TEXT_ICON_REGEXP,
} from '../regexp';
import {
  colouringReplacer,
  namespaceReplacer,
  textIconReplacer,
} from '../helpers';

export class FormattedText {
  protected constructor(readonly raw: string) {}

  static fromText(text: string | FormattedText) {
    if (text instanceof FormattedText) {
      return new FormattedText(text.raw);
    }
    return new FormattedText(text);
  }

  html() {
    return this.raw
      .replace(COLOURING_REGEXP, colouringReplacer)
      .replace(NAMESPACE_REGEXP, namespaceReplacer)
      .replace(TEXT_ICON_REGEXP, textIconReplacer);
  }
}
