import { debug } from '../helpers';
import { paramCase } from 'change-case';

export class CaseInsensitiveMap<T, U> extends Map<T, U> {
  protected readonly debug = debug.extend(paramCase(this.constructor.name));

  set(key: T, value: U): this {
    if (typeof key === 'string') {
      key = key.toLowerCase() as any as T;
    }
    return super.set(key, value);
  }

  get(key: T): U | undefined {
    if (typeof key === 'string') {
      key = key.toLowerCase() as any as T;
    }

    return super.get(key);
  }

  has(key: T): boolean {
    if (typeof key === 'string') {
      key = key.toLowerCase() as any as T;
    }

    return super.has(key);
  }
}
