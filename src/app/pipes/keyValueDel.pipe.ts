import { Pipe, PipeTransform } from '@angular/core';
import { zh_CN } from 'ng-zorro-antd';
import keyWare from './ware/key-ware';

@Pipe({
  name: 'keyValueDel',
})
export class KeyValueDelPipe implements PipeTransform {
  transform(obj: any, source = 'default') {
    const ZhCnArr = [];
    for (const key of Object.keys(obj)) {
      const ware = keyWare[key];
      if (ware) {
        const value = obj[key];
        const label = ware.label || key;
        let classValue = ware.classValue[value] || value;
        if (ware.classValue[source] !== undefined && source !== 'default') {
          classValue = ware.classValue[source][value];
        }
        ZhCnArr.push([
          label,
          classValue
        ]);
      }
    }
    return ZhCnArr;
  }
}
