import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { NzModalService } from 'ng-zorro-antd';
import { ToolService } from '../../../../tool/tool.service';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-finance-withdraw-list',
  templateUrl: './finance-withdraw-list.component.html',
  styleUrls: ['./finance-withdraw-list.component.scss']
})
export class FinanceWithdrawListComponent implements OnInit {
  public tableList = [];
  public page = {
    index: 1,
    total: 0
  };

  public totalPageAmount = 0;
  public totalPageRealAmount = 0;
  public totalRealAmount = 0;

  // 日志详情
  public logDetailData = {
    show: false,
    content: {},
    request_params: {},
  };

  // 审核数据
  public checkData = {
    show: false,
    buttonLoading: false,
    status_options: {
      '-2': '审核失败',
      2: '审核成功'
    },
    id: 0,
    withdrawNeedBetTimes: 0,
    lastWithdraw: [],
    lastRecharge: [],
    account: {
      balance: 0,
      frozen: 0,
      total_recharge: '',
      total_withdraw: '',
      created_at: ''
    },
    stat: {
      fetched_packet_amount: 0,
      send_packet_amount: 0,
      total_bet: 0,
      withdraw: 0,
      recharge: 0,
      gift: 0,
      total_recharge: 0,
      bet_times: 0,
    },
    user: {
      id: 0,
      nickname: '',
      fetched_packet_amount: 0,
      recharge: 0,
      withdraw: 0,
      register_time: '0',
      frozen_type: '',
    },
    order: {
      amount: 0,
      card_number: '',
    },
    data: {
      status: '2',
      reason: '',
      fund_password: ''
    },
  };

  // 手动
  public handData = {
    show: false,
    buttonLoading: false,
    type_options: {
      1: '人工失败',
      2: '人工成功'
    },
    id: 0,
    data: {
      type: null,
      amount: 0,
      reason: '',
      fund_password: ''
    },
  };

  public dateRange = [];
  public searchData = {
    page_index: 1,
    page_size: this.api.pageSize,
    order_id: '',
    username: '',
    user_id: '',
    start_time: '',
    end_time: '',
    status: 'all',
  };

  // 手动
  public withdrawOrderData = {
    show: false,
    buttonLoading: false,
    data: {
      user_id: '',
      amount: 0,
      fund_password: '',
      from: null,
      sign: 'finance_withdraw_bet_times'
    },
  };

  public status_options = {
    0: '初始化',
    1: '已领取',
    2: '审核成功',
    3: '代发成功',
    4: '回调成功',
    5: '人工成功',
    '-2': '审核失败',
    '-3': '代发失败',
    '-4': '回调失败',
    '-5': '人工失败',
  };

  constructor(
    public api: ApiService,
    public utils: ToolService,
    public http: HttpClient,
    private modalService: NzModalService
  ) {}

  // 初始化
  ngOnInit() {
    this.getDataList();
  }

  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  // 手动操作
  public doHand(item: any) {
    this.api.Http({name: 'withdrawHand', data: {action: 'option'}, attach: item.id + ''}).then((res: any) => {
      // this.handData.type_options = res.data.type_options;
    });
    this.handData.data = {
      type: null,
      amount: 0,
      reason: '',
      fund_password: ''
    };
    this.handData.data.amount = item.amount;
    this.handData.id = item.id;
    this.handData.show = true;
  }

  // 提交手动
  public submitHand() {
    this.handData.buttonLoading = true;
    const data = this.handData.data;
    for (const key in data) {
      if (data[key] == null || data[key] === undefined){
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '对不起,' + key + '不能为空!'
        });
        return false;
      }
    }

    // 提交
    this.api.Http({name: 'withdrawHand', data: {action: 'process', ...data}, attach: this.handData.id + ''}).then((res: any) => {
      if (res.success) {
        this.getDataList();
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '恭喜您, 手动处理成功 !'
        });

        this.handData.buttonLoading = false;
        this.back();
      } else {
        const modal = this.modalService.error({
          nzTitle: '温馨提示',
          nzContent: res.msg
        });
      }
      this.handData.show = false;
      this.handData.buttonLoading = false;
    }).catch(() => {this.handData.buttonLoading = false; });
  }

  // 返回
  public back() {
    this.logDetailData.show     = false;
    this.checkData.show         = false;
    this.withdrawOrderData.show = false;
  }

  // 跳转到日志列表
  public logDetail(item: any) {
    // this.log.detail = item;
    this.api.Http({name: 'withdrawLog', attach: item.id}).then((res: any) => {
      if (res.success) {
        this.logDetailData.show = true;
        this.logDetailData.content = res.data;
        this.logDetailData.request_params = res.data.request_params;
      }
    });
  }

  // 审核
  public check(item: any) {
    this.api.Http({name: 'withdrawCheckProcess', data: {action: 'fetch'}, attach: item.id + ''}).then((res: any) => {
      if (res.success) {
        this.checkData.show = true;
        this.checkData.lastRecharge = res.data.last_recharge;
        this.checkData.lastWithdraw = res.data.last_withdraw;
        this.checkData.stat         = res.data.stat;
        this.checkData.user         = res.data.user;
        this.checkData.order        = res.data.order;
        this.checkData.account      = res.data.account;
        this.checkData.withdrawNeedBetTimes   = res.data.withdraw_need_bet_times;

        this.checkData.id = res.data.order.id;

        if (res.data.withdraw_need_bet_times <= res.data.stat.bet_times) {
          this.checkData.data.status = '2';
        } else {
          this.checkData.data.status = '-2';
        }
      }
    });
  }

  // 提交审核结果
  public submitCheckData() {
    this.checkData.buttonLoading = true;
    const data = {...this.checkData.data};
    this.api.Http({name: 'withdrawCheckProcess', data, attach: this.checkData.id + ''}).then((res: any) => {
      if (res.success) {
        this.getDataList();
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '恭喜您, 处理成功 !'
        });

        this.checkData.buttonLoading = false;
        this.back();
      } else {
        const modal = this.modalService.error({
          nzTitle: '温馨提示',
          nzContent: res.msg
        });
      }

      this.checkData.buttonLoading = false;
    });
  }

  // 获取数据列表
  public getDataList() {
    this.searchData.page_index = this.page.index;
    this.api.Http({name: 'withdrawList', data: {...this.searchData}}).then((res: any) => {
      if (res.success) {
        this.page.total           = res.data.total;
        this.totalPageAmount      = res.data.pageTotalAmount;
        this.totalPageRealAmount  = res.data.pageTotalRealAmount;
        this.totalRealAmount      = res.data.totalRealAmount;
        this.tableList            = res.data.data;
      }
    });
  }

  // 日期选择框
  public onChange(result: Date): void {
    this.searchData['start_time'] = this.utils.formatTime(result[0], 'YYYY-MM-DD HH:MM:SS');
    this.searchData['end_time'] = this.utils.formatTime(result[1], 'YYYY-MM-DD HH:MM:SS');
  }

  // 点击时间选项框
  public timeHandle() {
    this.dateRange = [this.utils.timeInit(), this.utils.timeInit('???')];
  }


  // 导出数据
  public export() {
    this.api.Http({name: 'withdrawList', data: {is_export: 1}});
    const timeSet = setInterval(() => {
      const text = window['requestText'];
      if (text !== 'undefined') {
        clearInterval(timeSet);
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, '提现列表.txt');
      }
    }, 1000);
  }

  // 充值搜素
  public resetSearch() {
    this.page.index = 1;
    this.searchData = {
      page_index: 1,
      page_size: this.api.pageSize,
      order_id: '',
      username: '',
      user_id: '',
      start_time: '',
      end_time: '',
      status: 'all',
    };
    this.dateRange = [];
    this.getDataList();
  }

  // 搜索
  public doSearch() {
    this.page.index = 1;
    this.getDataList();
  }

  // 生成提现订单
  public genWithdrawOrder() {
    this.withdrawOrderData.data = {
      user_id: '',
      amount: 0,
      fund_password: '',
      from: null,
      sign: 'finance_withdraw_bet_times'
    };
    this.withdrawOrderData.show = true;
  }

  // 提交订单
  public submitWithdrawOrder() {
    this.api.Http({name: 'withdrawGenOrder', data: {...this.withdrawOrderData.data}}).then((res: any) => {
      if (res.success) {
        this.getDataList();
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '恭喜您, 添加成功 !'
        });

        this.withdrawOrderData.buttonLoading = false;
        this.back();
      } else {
        const modal = this.modalService.error({
          nzTitle: '温馨提示',
          nzContent: res.msg
        });
      }

      this.withdrawOrderData.buttonLoading = false;
    });
  }
}
