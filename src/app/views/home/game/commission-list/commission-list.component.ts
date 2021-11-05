import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-commission-list',
  templateUrl: './commission-list.component.html',
  styleUrls: ['./commission-list.component.scss']
})

export class CommissionListComponent implements OnInit {
  public tableList    = [];
  public dateRange    = [];

  public lotteryOptions = {};
  public defaultSelect  = ['所有系列'];

  public searchData = {
    page_size: 15,
    page_index: 1,
    lottery_sign: 'all',
    method_sign: 'all',
    series_id: 'all',
    username: '',
    issue: '',
    start_time: '',
    type: '',
    end_time: '',
    project_id: ''
  };

  public page = {
    index: 1,
    total: 0
  };

  public detailPop = {
    show: false,
    data: {}
  };

  public tableListType = 'parent';

  constructor(
    public utils: ToolService,
    public api: ApiService,
    public router: Router,
    private modalService: NzModalService
  ) { }

  // 初始化
  ngOnInit() {
    this.getDataList();
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

  // 获取数据
  public getDataList() {
    this.searchData.page_index = this.page.index;
    this.searchData.type = this.tableListType;
    this.api.Http({name: 'commissionList', data: this.searchData}).then((res: any) => {
      if (res.success) {
        this.page.total       = res.data.total;
        this.tableList        = res.data.data;
        this.lotteryOptions   = res.data.lottery_options;
      }
    });
  }

  // 分页
  public pageChange() {
    this.getDataList();
  }

  // 回退
  public back() {

  }

  // 搜索
  public search() {
    this.page.index = 1;
    this.getDataList();
  }

  // 重置搜索
  public resetSearch() {
    this.page.index = 1;
    this.searchData = {
      page_size: 15,
      page_index: 1,
      lottery_sign: 'all',
      method_sign: 'all',
      series_id: 'all',
      username: '',
      issue: '',
      type: '',
      start_time: '',
      end_time: '',
      project_id: ''
    };
    this.dateRange = [];
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

  // 选
  public doSelectLottery(event) {
    this.searchData.series_id     = event[0];
    this.searchData.lottery_sign  = event[1];
    this.searchData.method_sign   = event[2];
    this.getDataList();
  }

  public doChooseType(type) {
    this.tableListType = type;
    this.getDataList();
  }

  public doShowAccountChange(item) {

  }
}
