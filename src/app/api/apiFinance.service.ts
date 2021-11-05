import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ToolService } from '../tool/tool.service';
import { environment } from '../../environments/environment.prod';
import { ApiBase} from './apiBase';

@Injectable({
  providedIn: 'root'
})

export class ApiFinanceService {
  public domain: string = environment.apiBaseUrl;
  public token: any = '';
  public pageSize: any = 15;

  constructor(
    public http: HttpClient,
    public apiBase: ApiBase,
    public utils: ToolService
  ) {}

  /** ========================== 财务相关 ======================== */
  // 充值列表
  public rechargeList(params: any): any {
    return this.apiBase.post('finance/rechargeList', params).then((response: any) => response)
  }

  // 人工充值
  public rechargeHand(id, params: any): any {
    return this.apiBase.post('finance/rechargeHand/' + id, params).then((response: any) => response)
  }

  // 充值日志详情
  public rechargeLog(id: any): any {
    return this.apiBase.post('finance/rechargeLog/' + id).then((response: any) => response)
  }

  // 导出
  public rechargeExport(params: any): any {
    return this.apiBase.post('finance/rechargeExport').then((response: any) => response)
  }

  // 充值日志列表
  public rechargeLogList(params: any): any {
    return this.apiBase.post('finance/rechargeLogList', params).then((response: any) => response)
  }

  // 提现列表
  public withdrawList(params: any): any {
    return this.apiBase.post('finance/withdrawList', params).then((response: any) => response)
  }

  // 提现人工
  public withdrawLHand(id: any, params: any): any {
    return this.apiBase.post('finance/withdrawHand/' + id, params).then((response: any) => response)
  }

  // 提现日志
  public withdrawLog(id): any {
    return this.apiBase.post('finance/withdrawLog/' + id).then((response: any) => response)
  }

  // 提现日志列表
  public withdrawLogList(params): any {
    return this.apiBase.post('finance/withdrawLogList', params).then((response: any) => response)
  }

  // 提现订单生成
  public withdrawGenOrder(params): any {
    return this.apiBase.post('finance/withdrawGenOrder', params).then((response: any) => response)
  }

  // 提现审核处理
  public withdrawCheckProcess(id, params): any {
    return this.apiBase.post('finance/withdrawCheckProcess/' + id, params).then((response: any) => response)
  }
}
