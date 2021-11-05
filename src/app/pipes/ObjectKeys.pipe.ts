import { Pipe, PipeTransform } from '@angular/core';
import { zh_CN } from 'ng-zorro-antd';

@Pipe({
  name: 'objkeys',
})
export class ObjectKeysPipe implements PipeTransform {
  transform(obj: any) {
    return Object.keys(obj);
  }
}
