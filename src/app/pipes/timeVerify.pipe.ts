import { Pipe, PipeTransform } from '@angular/core';
import { zh_CN } from 'ng-zorro-antd';

@Pipe({
  name: 'timeVerify',
})
export class TimeVerifyPipe implements PipeTransform {
  transform(date: Array<Date>) {
    console.log(date);
  }
}
