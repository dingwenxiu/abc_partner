import { Injectable } from '@angular/core';
// import { type } from 'os';
// import ClipboardJS from './clipboard.min.js';

@Injectable({
  providedIn: 'root'
})
export class ToolService {
 // 设置缓存
 public storage = {
    set(key: string, value: any, expiration: number = 0): void {
     const obj: any = {};
     obj.data = value;
     obj.setTime = new Date().getTime();
     if (expiration) {
       obj.expiration = 60 * 60 * (24 * expiration);
     }
     localStorage.setItem(key, JSON.stringify(obj));
    },
    get(key: any) {
      let [item = JSON.parse(localStorage.getItem(key)), exp = null, nowTime = new Date().getTime()] = [];
      if (item) {
        if (item.data && item.data.expires_in) {
          exp = item.data.expires_in;
        } else if (item.expiration) {
          exp = item.expiration;
        }
        if (exp && nowTime - item.setTime > exp * 1000) {
          localStorage.removeItem(key);
          return false;
        }
      }
      return item;
    },
    remove(key: any) {
      localStorage.removeItem(key);
    }
  };

  constructor() { }

  // 获取默认商户标识
  public getDefaultPartnerSign() {
    const data =  this.storage.get('defaultPartnerSign');
    return [];
  }

  // 复制粘贴
  public copy(_copy: any, _txt: any) {
    // var _this = this
    // var copy = obj;
    // var clipboard = new ClipboardJS(copy)
    // console.log(clipboard)
    // copy.setAttribute('data-clipboard-target', txt)
    // clipboard.on('success', function (e: any) {
    //     e.clearSelection()
        // var layer = document.getElementsByClassName('tocal-layer')[0];
        // var bg = document.getElementsByClassName('tocal-layer-bg')[0];
        // layer.style.display = "block";
        // bg.style.display = "block";
        // layer.innerHTML = '复制成功'
        // setTimeout(function () {
        //     layer.style.display = "none";
        //     bg.style.display = "none";
        // }, 1500)
        // _this.footerLayer = false
    //     console.log('复制成功')
    // })
    // clipboard.on('error', function (e: any) {
    //     if (e.text.indexOf('http://') > -1) {
        //     var layer = document.getElementsByClassName('tocal-layer')[0];
        //     var bg = document.getElementsByClassName('tocal-layer-bg')[0];
        //     layer.style.display = "block";
        //     bg.style.display = "block";
        //     layer.innerHTML = '复制成功'
        //     setTimeout(function () {
        //         layer.style.display = "none";
        //         bg.style.display = "none";
        //     }, 1500)
        // _this.footerLayer = false
        // console.log('复制成功')
        // } else {
        // var copyDom = document.querySelector(txt)
        // var range = document.createRange()
        // range.selectNode(copyDom)
        // window.getSelection().removeAllRanges()
        // window.getSelection().addRange(range)
        // if (document.execCommand('copy')) {
        //     document.execCommand('copy')
            // var layer = document.getElementsByClassName('tocal-layer')[0];
            // var bg = document.getElementsByClassName('tocal-layer-bg')[0];
            // layer.style.display = "block";
            // bg.style.display = "block";
            // layer.innerHTML = '复制成功'
            // console.log('复制成功')
            // setTimeout(function () {
            //     layer.style.display = "none";
            //     bg.style.display = "none";
            // }, 1500)
            // _this.footerLayer = false
        // } else {
            // var layer = document.getElementsByClassName('tocal-layer')[0];
            // var bg = document.getElementsByClassName('tocal-layer-bg')[0];
            // layer.style.display = "block";
            // bg.style.display = "block";
            // console.log('抱歉，您的机型不支持邀请码复制')
            // layer.innerHTML = '抱歉，您的机型不支持邀请码复制'
            // setTimeout(function () {
            //     layer.style.display = "none";
            //     bg.style.display = "none";
            // }, 1500)
    //     }
    //     }
    // })
  }

  // 去除字符串中所有空格  if (!this.utils.removeAllSpace(this.username))
  public removeAllSpace(str: string) {
    return String(str).replace(/\s+/g, '');
  }

  // 小数点缩进 utils.computeMoney(12323, 10000)
  public computeMoney(money: any, decimal: any) {
    if (String(money).indexOf('.') > -1) {
      // tslint:disable-next-line:max-line-length
      return this.toFixed(Number(money) / Number(decimal), String(decimal).length - 1 + String(money).substring(String(money).indexOf('.') + 1).length);
    } else {
      return this.toFixed(money / decimal, String(decimal).substring(1).length);
    }
  }
  /*
  * 显示小数点后面几位
  * str 字符串
  * num 显示小数点后几位小数
  */
  public toFixed(str: any, num = 2) {
      if (String(str).indexOf('.') > -1) {
        let zeo = '';
        for (let i = 0; i < (num - String(str).substr(String(str).lastIndexOf('.') + 1, str.length).length); i++) {
          zeo += '0';
        }
        return String(str).substr(0, String(str).lastIndexOf('.') + num + 1) + zeo;
      } else {
          let zeo = ''
          for (let i = 0; i < num; i++) {
              zeo += '0'
          }
          return String(str) + '.' + zeo
      }
  }
  // 时间格式
  // obj 传入时间  返回 yyyy-mm-dd
  public formatTime(obj: any, format = 'YYYY-MM-DD HH:MM:SS') {
    if (!obj) {
      return;
    }
    if (typeof obj === 'string') {
      obj = Number(obj);
    }
    if (String(new Date(obj).getTime()).length < 13) {
      obj = new Date(obj).getTime() * 1000;
    }
    const date = new Date(obj);
    const date2: any = date.toLocaleDateString().split('/');
    let hours: any = date.getHours();
    let minutes: any = date.getMinutes();
    let seconds: any = date.getSeconds();
    if (date2[1] < 10) {
      date2[1] = '0' + date2[1];
    }
    if (date2[2] < 10) {
      date2[2] = '0' + date2[2];
    }
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    const dateDay = date2.join('-');
    if (format === 'YYYYMMDD') {
      return date2.join('');
    } else if (format === 'YYYY-MM-DD') {
      return dateDay;
    } else if (format === 'HH:MM:SS') {
      return hours + ':' + minutes + ':' + seconds;
    } else if (format === 'YYYY-MM-DD HH:MM:SS') {
      return dateDay + ' ' + hours + ':' + minutes + ':' + seconds;
    }
  }

  // 地区编号转换
  public searchArea(options, pid, cid) {
    let pname = '';
    let cname = '';
    for (const p of options) {
      if (p.value === pid - 0) {
        pname = p.label;
        for (const c of p.children) {
          if (c.value === cid - 0) {
            cname = c.label;
            return `${pname}/${cname}`;
          }
        }
      }
    }
  }

  public searchFinanceId(value: any, options: any) {
  }

  public ChangeDataValStr(data) {
    for (const key in data) {
      if (typeof data[key] === 'number') {
        data[key] = data[key] + '';
      }
    }
    return data;
  }

  public timeIsNow(time) {
    const date = new Date();
    const [hours, minutes] = [date.getHours(), date.getMinutes()];
    const [timeHours1, timeMinutes1] = [time[0].getHours(), time[0].getMinutes()];
    const [timeHours2, timeMinutes2] = [time[1].getHours(), time[1].getMinutes()];
    return {
      time1: hours === timeHours1 && minutes === timeMinutes1,
      time2: hours === timeHours2 && minutes === timeMinutes2,
    };
  }

  public timeToZero(time) {
    return new Date(time.setHours(0)).setMinutes(0);
  }

  public timeInit(timePlust = '') {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${timePlust ? '23:59:59' : '00:00:00'}`;
  }

  public timeCelen(time = 0, type = 0) {
    const date = new Date(time);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${type ? '23:59:59' : '00:00:00'}`;
  }

  public pswdEncode(password) {
    const head = Math.random().toString(36).slice(2, 7);
    const floor = Math.random().toString(36).slice(2, 6);
    return window.btoa(`${window.btoa(head + password)}${floor}`);
  }

  // public dateGap(dateArray: Date): Array<number> {
  //   const DATE_ARRAY = [dateArray[0].getTime(), dateArray[1].getTime()];
  //   const largest = 2592000000;
  //   const GAP = DATE_ARRAY[1] - DATE_ARRAY[0];
  //   if (GAP > largest) {
  //     DATE_ARRAY[0] = DATE_ARRAY[1] - largest;
  //   }
  //   return DATE_ARRAY;
  // }
}
