import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss']
})

/**
 * 奖期列表
 */
export class IssueListComponent implements OnInit {

  public tableList = [];
  public dateRange = [];

  public issueCancelData = {
    show:false,
    lottery_name:'',
    issue:'',
    id:'',
    data:{
      fund_password: '',
    }
  };

  public detail = {
    show: false,
    data: {
      lottery_name: '',
      issue: '',
      official_code: '',
      begin_time: '',
      end_time: '',
      encode_time: '',
      time_open: '',
      time_end_open: '',
      status_process: '',
      time_send: '',
      time_end_send: '',
      time_trace: '',
      time_end_trace: '',
      status_trace: '',
      time_commission: '',
      time_end_commission: '',
      status_commission: '',
    }
  };

  // 号码录入
  public encodeData = {
    show: false,
    lottery_name:'',
    issue:'',
    id:'',
    data: {
      code: '',
      fund_password: '',
    }
  };

  public searchData = {
    page_index: 1,
    page_size: null,
    issue: '',
    lottery_sign: '',
    start_time: '',
    end_time: '',
    series_id: ''
  };

  public total = 1;

  public options = null;

  // 选择系列
  public seriesOption = [];

  // 选择彩种
  public lotteryOption = [];

  // tab选项
  public lotteryTabOption = { all: '所有系列' };

  // 默认系列
  public defaultSeriesSign = 'all';

  // 默认索引
  public tabIndex = 0;

  constructor(
    public utils: ToolService,
    public api: ApiService,
    public router: Router,
    public modalService: NzModalService,
  ) {

  }

  ngOnInit() {
    this.timeInitialization();
  }

  private timeInitialization() {
    this.api.getTime().then( res => {
      const timestamp = res['data'];
      const [time1, time2] = [this.utils.timeCelen(timestamp, 0), this.utils.timeCelen(timestamp, 1)];
      this.dateRange = [time1, time2];
      this.searchData['start_time'] = time1;
      this.searchData['end_time'] = time2;
      this.getDataList();
    });
  }

  public current() {
    this.searchData.page_index = 1;
    this.setTime('00:00:00');
  }

  public async theDay() {
    this.searchData.page_index = 1;
    this.setTime('00:00:00', '23:59:59');
  }

  private setTime(dateMin, dateMax = '') {
    this.api.Http({name: 'getTimeNow'}).then(res => {
      const {success, data} = res;
      if (success) {
        const date = new Date(data);
        const dateReset = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const [min, max] = [new Date(`${dateReset} ${dateMin}`), new Date(dateMax ? `${dateReset} ${dateMax}` : date)];
        this.searchData['start_time'] = this.utils.formatTime(min, 'YYYY-MM-DD HH:MM:SS');
        this.searchData['end_time'] = this.utils.formatTime(max, 'YYYY-MM-DD HH:MM:SS');
        this.getDataList();
      }
    });
  }

  // 选择系列
  public doChangeSeries($event) {
    this.defaultSeriesSign = $event;
    this.lotteryTabOption = $event === 'all' ? { all: '所有系列' } : this.seriesOption[$event];
    this.tabIndex = 0;
    this.doTabChange(Object.keys(this.lotteryTabOption)[0]);
  }

  public search() {
    this.searchData.page_index = 1;
    this.getDataList();
  }

  public resetSearchData() {
    this.searchData = {
      page_index: 1,
      page_size: null,
      issue: '',
      lottery_sign: '',
      start_time: '',
      end_time: '',
      series_id: ''
    };
    this.defaultSeriesSign = 'all';
    this.dateRange = [];
    this.getDataList();
  }

  // 获取数据列表detailPop
  private getDataList() {
    this.searchData.page_size = this.api.pageSize;

    this.api.Http({ name: 'issueList', data: {...this.searchData} }).then((res: any) => {
      const { data, success } = res;
      if (success) {

        this.lotteryOption = data.lottery_options;
        this.seriesOption = data.series_options;

        this.tableList = data.data;
        this.total = data.total;
      }
    });
  }

  // 修改Tab
  public doTabChange(lotterySign) {
    this.searchData.lottery_sign = lotterySign;
    this.searchData.page_index = 1;
    this.api.Http({ name: 'issueList', data: this.searchData }).then((res: any) => {
      const { data, success } = res;
      if (success) {
        this.tableList = data.data;
        this.total = data.total;
      }
    });
  }

  // 页面变更
  public doPageChange() {
    this.getDataList();
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


  public doDetail(data) {
    this.detail.show = true;
    this.detail.data = data;
  }

  /* ======================== 录号 ======================= */
  // 显示录号页面
  public doEncodeView(item) {

    this.encodeData.lottery_name  = item.lottery_name;
    this.encodeData.issue         = item.issue;
    this.encodeData.id            = item.id;

    this.encodeData.show          = true;
  }

  public doEncodeSubmit() {
    const data = {...this.encodeData.data};
    this.api.Http({ name: 'issueEncode', data, attach: this.encodeData.id }).then((res: any) => {
      const { success } = res;
      if (success) {
        this.encodeData.show = false;
        this.encodeData.id = '';
        this.encodeData.lottery_name = '';
        this.encodeData.issue = '';

        this.getDataList();
      } else {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: res.msg
        });
      }
    });
  }

  /* ======================== 撤单 ======================= */
  public doCancel(item) {
    this.issueCancelData.lottery_name = item.lottery_name;
    this.issueCancelData.issue        = item.issue;
    this.issueCancelData.id           = item.id;

    this.issueCancelData.show = true;
  }

  public doCancelSubmit() {
    this.api.Http({ name: 'issueCancel', data: this.issueCancelData.data, attach:this.issueCancelData.id }).then((res: any) => {
      const { success } = res;
      if (success) {
        this.issueCancelData.show = false;
        this.issueCancelData.id = '';
        this.issueCancelData.lottery_name = '';
        this.issueCancelData.issue = '';

        this.getDataList();
      } else {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: res.msg
        });
      }
    });
  }
}
