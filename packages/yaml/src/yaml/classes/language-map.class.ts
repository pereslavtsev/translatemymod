import { CaseInsensitiveMap } from '../../misc';
import { LanguageKey } from '../types';
import { VersionMap } from './version-map.class';

export class LanguageMap extends CaseInsensitiveMap<LanguageKey, VersionMap> {
  get languages(): LanguageKey[] {
    return [...this.keys()];
  }

  language(language: LanguageKey) {
    return new LanguageMap([[language, this.get(language)]]);
  }
}
