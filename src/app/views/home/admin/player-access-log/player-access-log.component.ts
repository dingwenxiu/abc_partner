import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-admin-player-access-log',
  templateUrl: './player-access-log.component.html',
  styleUrls: ['./player-access-log.component.scss']
})
export class AdminPlayerAccessLogComponent implements OnInit {
  public page = {
    index: '1',
    size: null,
    total: 1
  };

  public detailPop = {
    show: false,
    data: {}
  };

  public searchData = {};
  public searchTime: any;

  public tableList = [];
  constructor(
    public utils: ToolService,
    public api: ApiService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.getDataList();
  }

  public getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.page.size || this.api.pageSize,
    };

    Object.assign(data, this.searchData);

    this.api.Http({name: 'userPlayerLogList', data}).then((res: any) => {
      if (res && res.success) {
        this.tableList = res.data.data;
        this.page.total = res.data.total;
      }
    });
  }

  public detail(item) {
    this.detailPop.show = true;
    this.detailPop.data = item;
  }

  public doPageChange() {
    this.getDataList();
  }

  public search() {
    this.page.index = 1 + '';
    this.getDataList();
  }

  public refresh() {
    this.searchData = {};
    this.page = {
      index: '1',
      size: '20',
      total: 0
    };
    this.getDataList();
  }

  // 日期选择框
  public onChange(result: Date): void {
    this.searchData['start_time'] = this.utils.formatTime(result[0], 'YYYY-MM-DD HH:MM:SS');
    this.searchData['end_time'] = this.utils.formatTime(result[1], 'YYYY-MM-DD HH:MM:SS');
  }

  // 点击时间选项框
  public timeHandle() {
    this.searchTime = [this.utils.timeInit(), this.utils.timeInit('???')];
  }

}
