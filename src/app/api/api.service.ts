import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import httpUrl from '../_config/http.config';
import { ToolService } from '../tool/tool.service';
import { environment } from '../../environments/environment.prod';
import { Router } from '@angular/router';
import { pbkdf2 } from 'crypto';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  public domain: string = environment.apiBaseUrl;
  public imgUrl = '';
  public uploadImg: string = environment.apiBaseUrl + '/partner-api/uploadImg';
  public avatarImgUpload: string = environment.apiBaseUrl + '/partner-api/system/avatarImgUpload';
  public token: any = '';
  public pageSize: any = 20;
  public loadingSwitch = false;
  public random = 0;
  public nowTime = 0;
  constructor(
    public http: HttpClient,
    public utils: ToolService,
    private router: Router
  ) {
    const user = this.utils.storage.get('user');
    if (user) {
      this.imgUrl = user.data['system_pic_base_url'] + '/';
    }
    this.random = Math.random();
  }

  public getTime() {
    return new Promise((resolve, reject) => {
      this.get('/partner-api/getTimeNow').then( res => {
        if (res['success']) {
          resolve(res);
        }
      });
    });
  }

  public get(url: string) {
    const api = this.domain + url;
    return new Promise((resolve, reject) => {
      this.http.get(api).subscribe((res) => {
        resolve(res);
      });
    });
  }

  public post(url: string, json: any = []) {
    const api = this.domain + url;
    const imgHttp = this.domain + 'noticeUploadImg';
    this.utils.storage.set('domain', imgHttp);
    return new Promise((resolve, reject) => {
      this.http.post(api, json).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        reject(error);
      });
    });
  }

  // 过滤JSON数据重复
  // JSON {}
  // data 被赋值数据 =号左边   sub 赋值数据 =号右边
  // this.addData.data = res.data.model;
  public filterData(data: any, sub: any) {
    for (const k of Object.keys(data)) {
      data[k] = sub[k];
    }
    return data;
  }

  // 通用请求
  public Http({name = '', data = {}, attach = ''}): any {
    this.loadingSwitch = true;
    const options = {...data};
    for (const key in data) {
      if (key.includes('password')) {
        options[key] = this.utils.pswdEncode(data[key]);
      }
    }
    const port = httpUrl[name];
    const url = `${port.url}${attach}`;

    if (port['type'] === 'get') {
      return this.get(port.url).finally(() => {
        this.loadingSwitch = false;
      });
    } else {
      return this.post(url, options)
      .then((response: any) => response)
      .finally(() => {
        this.loadingSwitch = false;
      });
    }
  }
}
