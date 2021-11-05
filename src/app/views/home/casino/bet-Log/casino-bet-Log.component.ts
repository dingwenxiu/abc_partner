import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-casino-bet-log',
  templateUrl: './casino-bet-Log.component.html',
  styleUrls: ['./casino-bet-Log.component.scss']
})
export class CasinoBetLogComponent implements OnInit {
  public page = {
    index: '1',
    size: this.api.pageSize,
    total: '1'
  };

  public detailPop = {
    show: false,
    data: {}
  };

  public searchData = {};
  public dateRange = [];
  public tableList = [];
  public platformOptions = [];
  constructor(
    public utils: ToolService,
    public api: ApiService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.getDataList();
    this.getPlatformOption();
  }

  public getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.page.size,
      ...this.searchData
    };

    this.api.Http({name: 'getBetLog', data}).then((res: any) => {
      if (res && res.success) {
        this.tableList = res.data.data;
        this.page.total = res.data.total;
      }
    });
  }

  // 获取数据列表
  public getPlatformOption() {
    this.api.Http({
      name: 'getPlatType'
    }).then((res: any) => {
      if (res && res.success) {
        this.platformOptions = res.data.plat_form;
      }
    });
  }

  public detail(item) {
    this.detailPop.data = item;
    this.detailPop.show = true;
  }

  public doPageChange() {
    this.getDataList();
  }

  // 日期选择框
  public onChange(result: Date): void {
    this.searchData['startTime']  = this.utils.formatTime(new Date(result[0]).getTime(), 'YYYY-MM-DD HH:MM:SS');
    this.searchData['endTime']    = this.utils.formatTime(new Date(result[1]).getTime(), 'YYYY-MM-DD HH:MM:SS');
  }

  // 选择日期
  public onCelen($event) {
    if ($event.length > 1) {
      this.dateRange = [this.utils.timeCelen($event[0], 0), this.utils.timeCelen($event[1], 1)];
    }
  }

  // 点击时间选项框
  public timeHandle() {
    this.dateRange = [this.utils.timeInit(), this.utils.timeInit('???')];
  }

  public resetSearch() {
    this.page.index = '1';
    this.dateRange = [];
    this.searchData = {};
    this.getDataList();
  }

  public search() {
    this.page.index = '1';
    this.getDataList();
  }
}
