import {DigitalItem} from './interface/digital-item';
import {DigitalGroup} from './interface/digital-group';
import {ViewInterface} from './interface/view.interface';
import {Md5} from 'ts-md5';
import {DigitalSetInterface} from './interface/digital-set.interface';

export class Utils {
  static get_metadata(item: DigitalItem | DigitalGroup | ViewInterface | DigitalSetInterface, key: string): string {
    if (item.metadata) {
      const value = item.metadata.find(e => e.key === key);
      if (value) {
        return value.value;
      }
    }
    return '';
  }

  static get_data_uri(item: DigitalItem | null): string {
    if (item && item.links) {
      for (const link of item.links) {
        if (link.type === 'data') {
          return link.uri;
        }
      }
    }
    return '';
  }
  static hash_pw(pw: string): string {
    return Md5.hashStr(pw, false) as string;
  }
  //
  // static then_ok<T, T2 = PromiseLike<boolean>>(func: ((arg: T) => T2)): ((arg: (T | PromiseLike<T> | undefined | null)) => T2) {
  //   return (arg: (T | PromiseLike<T> | undefined | null)) => func(arg as T);
  // }
}
