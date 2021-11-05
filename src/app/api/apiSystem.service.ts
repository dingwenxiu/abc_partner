import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ToolService } from '../tool/tool.service';
import { environment } from '../../environments/environment.prod';
import { ApiBase} from './apiBase';

@Injectable({
  providedIn: 'root'
})

export class ApiSystemService {
  public domain: string = environment.apiBaseUrl;
  public token: any = '';
  public pageSize: any = 15;

  constructor(
    public http: HttpClient,
    public apiBase: ApiBase,
    public utils: ToolService
  ) {}

  /** ================================================== 配置管理 ========================================== */
  // 后台配置列表
  public configList(params): any {
    return this.apiBase.post('configureList', params).then((response: any) => response)
  }

  // 后台配置 获取详情
  public configDetail(id): any {
    return this.apiBase.post('configureDetail/' + id).then((response: any) => response)
  }

  // 后台配置 刷新配置
  public configFlush(): any {
    return this.apiBase.post('configureFlush').then((response: any) => response)
  }

  // 后台配置 修改状态
  public configStatus(id): any {
    return this.apiBase.post('configureStatus/' + id).then((response: any) => response)
  }

  // 后台配置 添加
  public configAdd(pid, params): any {
    return this.apiBase.post('configureAdd/' + pid, params).then((response: any) => response)
  }

  // 后台配置 删除
  public configDel(id): any {
    return this.apiBase.post('configureDel/' + id).then((response: any) => response)
  }

  /** ==================================================== 推送 ================================================== */
  // 获取推送列表
  public pushTaskList(params: any): any {
    return this.apiBase.post('pushTaskList', params).then((response: any) => response)
  }

  // 获取推送列表
  public pushTaskAdd(id, data: any): any {
    return this.apiBase.post('pushTaskAdd/' + id, data).then((response: any) => response)
  }

  // 修改推送状态
  public pushTaskStatus(id): any {
    return this.apiBase.post('pushTaskStatus/' + id).then((response: any) => response)
  }

  // 删除推送
  public pushTaskDel(id): any {
    return this.apiBase.post('pushTaskDel/' + id).then((response: any) => response)
  }

  // 推送详情
  public pushTaskDetail(id): any {
    return this.apiBase.post('pushTaskDetail/' + id).then((response: any) => response)
  }


  /** ===================================================== 公告 ================================================ */
  // 获取公告列表
  public noticeList(params: any): any {
    return this.apiBase.post('/system/noticeList', params).then((response: any) => response)
  }

  // 添加
  public noticeAdd(id: any, data: any): any {
    return this.apiBase.post('system/noticeAdd/' + id, data).then((response: any) => response)
  }

  // 修改状态
  public noticeStatus(id: any): any {
    return this.apiBase.post('/system/noticeStatus/' + id).then((response: any) => response)
  }

  // 置顶
  public noticeTop(id: any): any {
    return this.apiBase.post('system/noticeTop/' + id).then((response: any) => response)
  }

  // 刷新缓存
  public noticeFlush(): any {
    return this.apiBase.post('system/noticeFlush').then((response: any) => response)
  }

  /** =================================================== 缓存相关 ============================================== */
  // 缓存列表
  public cacheList(params: any): any {
    return this.apiBase.post('cacheList', params).then((response: any) => response)
  }

  // 刷新所有缓存
  public cacheFlush(key: any): any {
    return this.apiBase.get('cacheFlush/' + key).then((response: any) => response)
  }

}
