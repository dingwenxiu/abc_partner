import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ToolService } from '../../../../tool/tool.service';
import { TouchSequence } from 'selenium-webdriver';
import { ExcelService } from '../../../../api/excel.service';
@Component({
  selector: 'app-withdraw-passed-list',
  templateUrl: './withdraw-passed-list.component.html',
  styleUrls: ['./withdraw-passed-list.component.scss']
})

export class FinancewithdrawPassedListComponent implements OnInit, OnDestroy {

  public contentPop = {
    show: false,
    data: ''
  };
  public tableList = [];
  public dateRange: any;
  public page = {
    index: 1,
    total: 0,
    selectedTotalPage: false
  };
  public searchData = {
    page_index: 1,
    page_size: 20
  };

  public exportPop = {
    show: false,
    loading: false
  };

  public requestTime = [];
  public checkTime = [];

  public handPop = {
    show: false,
    id: '',
    data: {}
  };

  public detailPop = {
    show: false,
    data: {}
  };
  public detailsStatus = {
    0: '等待审核',
    1: '领取审核',
    2: '审核成功',
    3: '审核成功',
    4: '提现成功',
    5: '提现成功',
    6: '等待审核',
    7: '审核成功',
    8: '审核成功',
    9: '领取审核',
    '-2': '提现失败',
    '-3': '代付失败',
    '-4': '提现失败',
    '-5': '提现失败',
    '-6': '提现失败'
  }
  // 审核里面搜索
  public detailsTimes = {
    id: 0
  }

  // 审核数据
  public checkData = {
    show: false,
    audit: false,
    buttonLoading: false,
    status_options: {
      0: '待定',
      '-2': '审核失败',
      2: '审核成功',
    },
    id: 0,
    withdrawNeedBetTimes: 0,
    lastWithdraw: [],
    lastRecharge: [],
    account_channel: [],
    account: {
      balance: 0,
      frozen: 0,
      total_recharge: 0,
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

  // 提交审核
  public submitCheckDatas = {
    id: '',
    status: '',
    platform_channel_id: '',
    reason: ''
  };

  public pageAmount: any;
  public pageRealAmount: any;
  public totalAmount: any;
  public totalRealAmount: any;

  public bankSignOption = [];
  public refreshRate = 20000;
  public refreshFlag = false;
  public refreshClock: any;
  constructor(
    public api: ApiService, public toolService: ToolService, private modalService: NzModalService, public message: NzMessageService,
    private excelService: ExcelService) {

  }

  // 初始化
  ngOnInit() {
    this.getDataList();
    this.getBankList();
  }

  ngOnDestroy() {
    clearInterval(this.refreshClock);
  }
  public details(item: any) {
    this.detailsTimes = {
      id: 0
    }
    this.checkData.audit = false;
    this.detailsTimes.id = item.id;
    this.api.Http({ name: 'withdrawPassedList', attach: item.id }).then((res: any) => {
      if (res.success) {
        this.checkData.show = true;
        this.submitCheckDatas.status = '';
        this.submitCheckDatas.platform_channel_id = '';
        this.checkData.account_channel = res.data.account_channel;
        this.checkData.lastRecharge = res.data.last_recharge;
        this.checkData.lastWithdraw = res.data.last_withdraw;
        this.checkData.stat = res.data.stat;
        this.checkData.user = res.data.user;
        this.checkData.order = res.data.order;
        this.checkData.account = res.data.account;
        this.checkData.withdrawNeedBetTimes = res.data.withdraw_need_bet_times;
        this.detailsTimes['start_time'] = new Date(res.data.stat.recharge_first);
        this.detailsTimes['end_time'] = new Date(res.data.stat.recharge_last);
        this.checkData.id = res.data.order.id;
      }
    });
  }
  // 提交审核
  public async submitCheckData() {
    if (!/\S/.test(this.submitCheckDatas['reason']) && this.submitCheckDatas['status'] != '2') {
      const modal = this.modalService.success({
        nzTitle: '温馨提示',
        nzContent: '对不起,请填写原因!'
      });
      return;
    }
    const res = await this.api.Http({ name: 'withdrawCheckProcess', data: this.submitCheckDatas, attach: this.submitCheckDatas.id + '' });
    if (res.success) {
      this.getDataList();
      this.message.create('success', res.msg);
      this.checkData.show = false;
    }
  }

  public doHand(item) {
    this.handPop = {
      show: true,
      id: item.id,
      data: {}
    };
  }

  public async subHank() {
    // {type: this.handPop.data, action: 'process'},
    if (!this.handPop.data['reason'] || !/\S/.test(`${this.handPop.data['reason']}`) && this.handPop.data['type'] !== '5') {
      const modal = this.modalService.success({
        nzTitle: '温馨提示',
        nzContent: '对不起,请填写原因!'
      });
      return;
    }
    const res = await this.api.Http({ name: 'withdrawHand', data: this.handPop.data, attach: this.handPop.id + '' })

    if (res.success) {
      this.getDataList();
      this.message.create('success', res.msg);
      this.handPop.show = false;
    }
  }

  public check(item: any, type: any = false) {
    this.detailsTimes = {
      id: 0
    };

    this.submitCheckDatas.id = item.id;
    this.detailsTimes.id = item.id;
    if (type) {
      this.checkData.audit = true;
    } else {
      this.checkData.audit = false;
    }
    this.api.Http({ name: 'withdrawCheckProcess', data: { action: 'fetch' }, attach: item.id + '' }).then((res: any) => {
      if (res.success) {
        this.checkData.show = true;
        this.submitCheckDatas.status = '';
        this.submitCheckDatas.platform_channel_id = '';
        this.checkData.account_channel = res.data.account_channel;
        this.checkData.lastRecharge = res.data.last_recharge;
        this.checkData.lastWithdraw = res.data.last_withdraw;
        this.checkData.stat = res.data.stat;
        this.checkData.user = res.data.user;
        this.checkData.order = res.data.order;
        this.checkData.account = res.data.account;
        this.checkData.withdrawNeedBetTimes = res.data.withdraw_need_bet_times;
        this.detailsTimes['start_time'] = new Date(res.data.stat.recharge_first);
        this.detailsTimes['end_time'] = new Date(res.data.stat.recharge_last);
        this.checkData.id = res.data.order.id;
      }
    });
  }
  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  public refresh($event) {
    if ($event) {
      this.refreshClock = setInterval(() => {
        this.getDataList();
      }, this.refreshRate);
    } else {
      clearInterval(this.refreshClock);
    }
  }

  // 获取数据列表
  public getDataList() {
    const data = {};
    Object.assign(data, this.searchData);
    this.api.Http({ name: 'viewWithdrawList', data: {...data, type: 3}, attach: '0' }).then((res: any) => {
      if (res.success) {
        this.page.total = res.data.total;
        this.pageAmount = res.data.pageTotalAmount;
        this.pageRealAmount = res.data.pageTotalRealAmount;
        this.totalAmount = res.data.totalAmount;
        this.totalRealAmount = res.data.totalRealAmount;
        this.tableList = res.data.data;
      }
    });
  }

  public detailSearch() {
    this.api.Http({ name: 'withdrawPassedList', data: {
      ...this.detailsTimes,
      start_time: this.toolService.formatTime(this.detailsTimes['start_time']),
      end_time: this.toolService.formatTime(this.detailsTimes['end_time'])
    }, attach: this.detailsTimes.id + '' }).then((res: any) => {
      if (res.success) {
        if (res.data['stat']) {
          this.checkData.stat = res.data.stat;
        } else {
          this.checkData.stat = {
            fetched_packet_amount: 0,
            send_packet_amount: 0,
            total_bet: 0,
            withdraw: 0,
            recharge: 0,
            gift: 0,
            total_recharge: 0,
            bet_times: 0,
          };
        }
      }
    });
  }

  public getBankList() {
    this.api.Http({ name: 'playerCardList', data: { page_index: 1, page_size: 1 } }).then((res: any) => {
      if (res.success) {
        const signArray = [];
        for (const key in res.data.bank_list) {
          if (key) {
            signArray.push({ key, label: res.data.bank_list[key] });
          }
        }
        this.bankSignOption = signArray;
      }
    });
  }

  // 获取数据列表
  public resetSearch() {
    this.searchData = {
      page_index: 1,
      page_size: 20
    };
    this.requestTime = null;
    this.checkTime = null;
    this.getDataList();
  }

  public serach() {
    this.searchData.page_index = 1;
    this.getDataList();
  }

  // 日期选择框
  public onRequestChange(result: Date): void {
    this.searchData['start_request_time'] = this.toolService.formatTime(result[0], 'YYYY-MM-DD HH:MM:SS');
    this.searchData['end_request_time'] = this.toolService.formatTime(result[1], 'YYYY-MM-DD HH:MM:SS');
  }

  // 点击时间选项框
  public requestTimeHandle() {
    this.requestTime = [this.toolService.timeInit(), this.toolService.timeInit('???')];
    this.searchData['start_request_time'] = this.toolService.formatTime(this.requestTime[0], 'YYYY-MM-DD HH:MM:SS');
    this.searchData['end_request_time'] = this.toolService.formatTime(this.requestTime[1], 'YYYY-MM-DD HH:MM:SS');
  }

  // 日期选择框
  public oncCheckChange(result: Date): void {
    this.searchData['start_day_m'] = this.toolService.formatTime(result[0], 'YYYY-MM-DD HH:MM:SS');
    this.searchData['end_day_m'] = this.toolService.formatTime(result[1], 'YYYY-MM-DD HH:MM:SS');
  }

  // 点击时间选项框
  public checkTimeHandle() {
    this.checkTime = [this.toolService.timeInit(), this.toolService.timeInit('???')];
    this.searchData['start_day_m'] = this.toolService.formatTime(this.checkTime[0], 'YYYY-MM-DD HH:MM:SS');
    this.searchData['end_day_m'] = this.toolService.formatTime(this.checkTime[1], 'YYYY-MM-DD HH:MM:SS');
  }

  // 导出数据
  public async export(type) {
    if (type) {
      this.exportPop = {
        show: true,
        loading: false
      };

    } else {
      this.exportNowPage();
    }
  }

  private exportPage(tableData, fileName) {
    const logListArray = [];
    const tableList = tableData;
    for (const data of tableList) {
      logListArray.push(this.formatListXlsx(data));
    }
    this.excelService.exportAsExcelFile(logListArray, fileName);
  }

  private formatListXlsx(data) {
    return {
      ID: data.id,
      用户ID: data.user_id,
      昵称: data.nickname,
      订单号: data.order_id,
      提现金额: +data.amount,
      实际金额: +data.real_amount,
      银行: data.bank_name,
      认领人: data.claim_admin_id,
      处理人: data.check_admin_id,
      发起时间: data.request_time,
      认领时间: data.claim_time,
      处理时间: data.wind_process_time,
      成功时间: data.process_time,
      请求IP: data.client_ip,
      提现备注: data.mark,
      状态: this.switchStatus(data.status)
    };
  }

  private exportNowPage() {
    this.exportPage(this.tableList, '提现记录(财务)');
  }

  public async exportAllPage() {
    this.page.selectedTotalPage = true;
    this.exportPop.loading = true;
    const exportExcel = [];
    for (let i = 1; this.page.selectedTotalPage; i++) {
      const response = await this.api.Http({
        name: 'viewWithdrawList',
        data: {
          ...this.searchData,
          page_size: 2000,
          page_index: i,
          type: 3
        },
        attach: '0'
      });
      const { data, success } = response;
      if (success) {
        exportExcel.push(...data.data);
      }
      if ((!((i * 2000) % 100000) || !data.data.length) || !this.page.selectedTotalPage) {
        this.exportPage(exportExcel, `提现记录(财务)-${i}`);
      }
      if (!data.data.length) {
        break;
      }
    }
    this.exportPop = {
      show: false,
      loading: false
    };
    this.modalService.success({
      nzTitle: '温馨提示',
      nzContent: `下载完成`
    });
  }

  private switchStatus(status) {
    return this.detailsStatus[status];
  }

  public stopDownload() {
    this.page.selectedTotalPage = false;
    this.exportPop.loading = false;
  }

  public lockTd($event) {
    const notNode = ['P', 'SECTION'];
    const {target} = $event;
    if (notNode.includes(target.nodeName) && target.id !== 'operating' || target.id === 'text-content') {
      this.contentPop = {
        show: true,
        data: $event.target.innerHTML
      };
    }
  }
}
