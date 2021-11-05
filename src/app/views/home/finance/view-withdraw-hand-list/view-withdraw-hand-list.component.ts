import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { ToolService } from '../../../../tool/tool.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { ExcelService } from '../../../../api/excel.service';
@Component({
  selector: 'app-view-withdraw-hand-list',
  templateUrl: './view-withdraw-hand-list.component.html',
  styleUrls: ['./view-withdraw-hand-list.component.scss']
})
export class ViewWithdrawHandListComponent implements OnInit {
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
  // 审核里面的状态
  public detailsStatus = {
    '0': '等待审核',
    '1': '领取审核',
    '2': '财务审核成功',
    '3': '代付成功',
    '4': '回调成功',
    '5': '人工成功',
    '6': '风控审核成功',
    '-2': '财务审核失败',
    '-3': '代付失败',
    '-4': '回调失败',
    '-5': '人工失败',
    '-6': '风控审核失败'
  }
  // 审核里面搜索
  public detailsTimes = {
    id: 0,
    start_time: '',
    end_time: ''
  }
  // 审核数据
  public checkData = {
    show: false,
    audit: false,
    buttonLoading: false,
    status_options: {
      0: '待定',
      '-6': '审核失败',
      '6': '审核成功'
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
    reason: ''
  };


  public totalPageAmount: any;
  public totalPageRealAmount: any;
  public totalRealAmount: any;

  public bankSignOption = [];
  totalAmount: any;
  constructor(
    public api: ApiService,
    public toolService: ToolService,
    private modalService: NzModalService,
    public message: NzMessageService,
    private excelService: ExcelService
  ) {
  }

  // 初始化
  ngOnInit() {
    this.getDataList();
    this.getBankList();
  }
  // 搜索
  public detailsSearch() {
    this.detailsTimes.start_time = this.toolService.formatTime(this.detailsTimes.start_time);
    this.detailsTimes.end_time = this.toolService.formatTime(this.detailsTimes.end_time);
    this.api.Http({ name: 'withdrawPassedList', data: this.detailsTimes, attach: this.detailsTimes.id + '' }).then((res: any) => {
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
          }
        }
      }
    });
  }
  public details(item: any) {
    this.detailsTimes = {
      id: 0,
      start_time: '',
      end_time: ''
    };
    this.detailsTimes.id = item.id;
    this.api.Http({ name: 'viewWithdrawList', data: { tyep: 2 }, attach: item.id }).then((res: any) => {
      if (res.success) {
        this.checkData.show = true;
        this.submitCheckDatas.status = '';

        this.checkData.account_channel = res.data.account_channel;
        this.checkData.lastRecharge = res.data.last_recharge;
        this.checkData.lastWithdraw = res.data.last_withdraw;
        this.checkData.stat = res.data.stat;
        this.checkData.user = res.data.user;
        this.checkData.order = res.data.order;
        this.checkData.account = res.data.account;
        this.checkData.withdrawNeedBetTimes = res.data.withdraw_need_bet_times;

        this.checkData.id = res.data.order.id;
      }
    });
  }

  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  // 获取数据列表
  public getDataList() {
    const data = { type: 2 };
    Object.assign(data, this.searchData);
    this.api.Http({ name: 'viewWithdrawList', data, attach: '0' }).then((res: any) => {
      if (res.success) {
        this.page.total = res.data.total;
        this.totalPageAmount = res.data.pageTotalAmount;
        this.totalPageRealAmount = res.data.pageTotalRealAmount;
        this.totalRealAmount = res.data.totalRealAmount;
        this.totalAmount = res.data.totalAmount;
        this.tableList = res.data.data;
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
    this.searchData['start_check_time'] = this.toolService.formatTime(result[0], 'YYYY-MM-DD HH:MM:SS');
    this.searchData['end_check_time'] = this.toolService.formatTime(result[1], 'YYYY-MM-DD HH:MM:SS');
  }

  // 点击时间选项框
  public requestTimeHandle() {
    this.requestTime = [this.toolService.timeInit(), this.toolService.timeInit('???')];
    this.searchData['start_check_time'] = this.toolService.formatTime(this.dateRange[0], 'YYYY-MM-DD HH:MM:SS');
    this.searchData['end_check_time'] = this.toolService.formatTime(this.dateRange[1], 'YYYY-MM-DD HH:MM:SS');
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
    this.exportPage(this.tableList, '人工提现表');
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
          type: 2
        },
        attach: '0'
      });
      const { data, success } = response;
      if (success) {
        exportExcel.push(...data.data);
      }
      if ((!((i * 2000) % 100000) || !data.data.length) || !this.page.selectedTotalPage) {
        this.exportPage(exportExcel, `人工提现表-${i}`);
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

  public withdrawHand() {
    const data = {
      ...this.handPop.data
    };

    if (data['type'] === -5 && !/\S/.test(data['reason'])) {
      this.modalService.success({
        nzTitle: '温馨提示',
        nzContent: `请填写失败原因`
      });
      return;
    }
    this.api.Http({name: 'withdrawHand', data, attach: this.handPop.id}).then(res => {
      if (res.success) {
        this.getDataList();
        this.handPop = {
          show: false,
          id: '',
          data: {}
        }
      }
    });
  }

  public success(item) {
    this.handPop = {
      show: true,
      id: item.id,
      data: {}
    };
    this.handPop.data['type'] = 5;
  }

  public fail(item) {
    this.handPop = {
      show: true,
      id: item.id,
      data: {}
    };
    this.handPop.data['type'] = -5;
  }

  public async subHank(id) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认领取审核</b>',
      nzOnOk: async () => {
        const res = await this.api.Http({ name: 'withdrawHand', data: {action: 'option'}, attach: id + '' });
        if (res.success) {
          this.getDataList();
          this.message.create('success', res.msg);
          this.handPop.show = false;
        }
      }
    });
  }
}
