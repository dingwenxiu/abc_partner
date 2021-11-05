import { Pipe, PipeTransform } from '@angular/core';
import { zh_CN } from 'ng-zorro-antd';

@Pipe({
  name: 'keyTrans',
})
export class KeyTranslationPipe implements PipeTransform {
  transform(key: any) {
    const newKey = key.replace(/&/g, ',');
    return newKey;
  }
}
