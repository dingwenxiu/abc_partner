import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { ToolService } from '../../../../tool/tool.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { ExcelService } from '../../../../api/excel.service';
@Component({
  selector: 'app-finance-recharge-list',
  templateUrl: './finance-recharge-list.component.html',
  styleUrls: ['./finance-recharge-list.component.scss']
})
export class FinanceRechargeListComponent implements OnInit, OnDestroy {

  public tableList = [];
  public page = {
    index: 1,
    total: 0,
    selectedTotalPage: false
  };

  public totalPageAmount = 0;
  public totalPageRealAmount = 0;
  public totalRealAmount = 0;

  // 日志详情
  public log = {
    show: false,
    buttonLoading: false,
    id: 0
  };

  public logDetails = {
    request_params: {
      username: '',
      ip: '',
      request_status: '',
      request_time: '',
      merchant_id: '',
      amount: 0,
      order_id: '',
      source: '',
      channel: '',
      callback_url: '',
      client_ip: '',
      time: '',
      sign: '',
      back_ip: '',

    },
    request_back: {
      status: '',
      msg: '',
      data: '',
    },
    order: {},
    username: '',
    nickname: '',
    amount: 0,
    ip: 0,
    request_status: 0,
    request_reason: 0,
    request_time: 0,
    back_ip: '',
    back_time: '',
    back_status: '',
    back_reason: '',
  };

  // 来源
  public from_device = {
    0: 'web端',
    1: '移动端'
  };

  // 日志详情
  public handData = {
    show: false,
    buttonLoading: false,
    id: 0,
    type_options: {
      2: '人工成功'
    },

    details: {
      username: '',
      nickname: '',
      order_id: '',
      amount: '',
      real_amount: '',
      sign: '',
      source: '',
      client_ip: '',
      init_time: '',
      callback_time: '',
      admin_id: '',
      status: 0,

    },
    data: {
      type: 2,
      amount: 0,
      reason: ''
    },
  };

  public dateRange = [];
  public searchData = {
    page_index: 1,
    page_size: this.api.pageSize
  };

  public exportPop = {
    show: false,
    loading: false
  };

  public status_options = {
    '0'   : '初始化',
    '1'   : '代发成功',
    '2'   : '回调成功',
    '3'   : '人工成功',
    '-1'  : '代发失败',
    '-2'  : '回调失败',
    '-3'  : '人工失败'
  };

  public refreshRate = 20000;
  public refreshFlag = false;
  public refreshClock: any;
  public chennelOption = {};
  constructor(
    public api: ApiService,
    public message: NzMessageService,
    public utils: ToolService,
    public http: HttpClient,
    private modalService: NzModalService,
    private excelService: ExcelService,
    ) {}

  // 初始化
  ngOnInit() {
    this.getDataList();
  }

  ngOnDestroy() {
    clearInterval(this.refreshClock);
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

  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  // 手动操作
  public rechargeHand(item: any) {
    this.handData.data = {
      type: 2,
      amount: item.amount,
      reason: null
    };
    this.handData.id       = item.id;
    this.api.Http({name: 'rechargeHand', data: {action: 'option'}, attach: this.handData.id + ''}).then((res: any) => {
      this.handData.show = true;
      this.handData.details = res.data;
    });
  }

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
    this.api.Http({name: 'rechargeHand',
    data: {...this.handData.data}, attach: this.handData.id + ''}).then((res: any) => {
      if (res.success) {
        this.getDataList();
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '恭喜您, 手动处理成功 !'
        });
        this.handData.buttonLoading = false;
        this.back();
      }

      this.handData.buttonLoading = false;
    }).catch(() => {this.handData.buttonLoading = false; });
  }

  // 返回
  public back() {
    this.handData.show = false;
    this.log.show = false;
  }

  // 跳转到日志列表
  public logDetail(item: any) {
    this.api.Http({name: 'rechargeLog', attach: item.id + ''}).then( (res: any) => {
      if (res.success) {
        this.log.show = true;
        this.logDetails = res.data;
      }
    })
  }

  // 获取数据列表
  public getDataList() {
    this.searchData.page_index = this.page.index;
    this.api.Http({name: 'rechargeList', data: {...this.searchData}}).then((res: any) => {
      this.tableList = res.data.data;
      this.chennelOption = res.data.channel_sign_options;
      this.page.total = res.data.total;
      this.totalPageAmount      = res.data.pageTotalAmount;
      this.totalPageRealAmount  = res.data.pageTotalRealAmount;
      this.totalRealAmount      = res.data.totalRealAmount;
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

  // // 导出数据
  // public export() {
  //   this.api.Http({name: 'rechargeList', data: {is_export: 1}});
  //   const timeSet = setInterval(() => {
  //     const text = window['requestText'];
  //     if (text !== 'undefined') {
  //       clearInterval(timeSet);
  //       const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  //       saveAs(blob, '充值列表.txt');
  //     }
  //   }, 1000);
  // }

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
      用户ID: data.user_id,
      用户名: data.username,
      用户等级: data.vip_level,
      订单号: data.order_id,
      FMIS订单号: data.pay_order_id,
      金额: +data.amount,
      手续费: +data.fee_amount,
      实际上分: +data.real_amount,
      IP: data.client_ip,
      提交时间: this.utils.formatTime(data.request_time),
      到账时间: data.day_m,
      充值方式: data.channel_sign,
      渠道: data.platform_sign,
      管理员: data.partner_admin_id,
      来源: this.from_device[data.from_device],
      状态: this.switchStatus(data)
    };
  }

  private exportNowPage() {
    this.exportPage(this.tableList, '充值列表');
  }

  public async exportAllPage() {
    this.page.selectedTotalPage = true;
    this.exportPop.loading = true;
    const exportExcel = [];
    for (let i = 1; this.page.selectedTotalPage ; i++) {
      const response = await this.api.Http({
        name: 'rechargeList',
        data: {
          ...this.searchData,
          page_size: 2000,
          page_index: i
        }
      });
      const {data, success} = response;
      if (success) {
        exportExcel.push(...data.data);
      }
      if ( (!((i * 2000) % 100000) || !data.data.length) || !this.page.selectedTotalPage) {
        this.exportPage(exportExcel, `充值列表-${i}`);
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

  private switchStatus(data) {
    if (data.status == 0) {
      return '初始化';
    } else if (data.status == 1) {
      return '代发成功';
    } else if (data.status == 2) {
      return '回调成功';
    } else if (data.status == 3) {
      return '人工成功';
    } else if (data.is_win == '-1') {
      return '代发失败';
    } else if (data.is_win == '-2') {
      return '回调失败';
    } else if (data.is_win == '-3') {
      return '人工失败';
    }
  }

  public stopDownload() {
    this.page.selectedTotalPage = false;
    this.exportPop.loading = false;
  }

  // 获取数据列表
  public resetSearch() {
    this.page.index = 1;
    this.searchData = {
      page_index: 1,
      page_size: this.api.pageSize
    };
    this.dateRange = [];
    this.getDataList();
  }
}
