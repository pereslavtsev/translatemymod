import { CaseInsensitiveMap } from '../../misc';
import { FormattedText, text } from '../../text';
import { VersionKey } from '../types';

export class VersionMap extends CaseInsensitiveMap<VersionKey, FormattedText> {
  readonly v = this.version;

  set(version: VersionKey, value: FormattedText | string) {
    const formattedText = text(value);
    return super.set(version, formattedText);
  }

  get versions(): VersionKey[] {
    return [...this.keys()];
  }

  get latestVersion(): VersionKey {
    return Math.max(...this.versions);
  }

  version(version = this.latestVersion): FormattedText | null {
    return super.get(version) ?? null;
  }
}
