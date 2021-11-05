import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-admin-access-log',
  templateUrl: './access-log.component.html',
  styleUrls: ['./access-log.component.scss']
})
export class AccessLogComponent implements OnInit {
  public tableList = [];
  public searchData = {
    partner_admin_user: '',
    route: ''
  };
  public page = {
    index: 1,
    total: 0
  };

  public contentPop = {
    show: false,
    data: ''
  };

  public dateRange = [];

  constructor(
    private api: ApiService,
    private utils: ToolService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getDataList();
  }


  private getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: 15,
    };
    Object.assign(data, this.searchData);
    this.api.Http({ name: 'accessLogList', data }).then((res: any) => {
      if (res.success) {
        this.tableList = res.data.data;
      }
    });
  }

  public search() {
    this.page.index = 1;
    this.getDataList();
  }
  public refresh() {
    this.searchData = {
      partner_admin_user: '',
      route: ''
    };
    this.dateRange = [];
    this.getDataList();
  }

  public doPageChange() {
    this.getDataList();
  }

  public lockTd($event) {
    const notNode = ['P'];
    const { target } = $event;
    if (notNode.includes(target.nodeName) && target.id !== 'operating') {
      this.contentPop = {
        show: true,
        data: $event.target.innerText
      };
    }
  }

  // 日期选择框
  public onChange(result: Date): void {
    const DATE_ARRAY = [result[0].getTime(), result[1].getTime()];
    const largest = 2591999000;
    const GAP = DATE_ARRAY[1] - DATE_ARRAY[0];
    if (GAP > largest) {
      DATE_ARRAY[0] = DATE_ARRAY[1] - largest;
      const modal = this.modalService.success({
        nzTitle: '温馨提示',
        nzContent: '只能选择区间一个月内的时间!'
      });
      this.dateRange = [new Date(DATE_ARRAY[0]), new Date(DATE_ARRAY[1])];
    }
    this.searchData['start_time'] = this.utils.formatTime(DATE_ARRAY[0], 'YYYY-MM-DD HH:MM:SS');
    this.searchData['end_time'] = this.utils.formatTime(DATE_ARRAY[1], 'YYYY-MM-DD HH:MM:SS');
  }

  // 点击时间选项框
  public timeHandle() {
    this.dateRange = [this.utils.timeInit(), this.utils.timeInit('max')];
  }
}
