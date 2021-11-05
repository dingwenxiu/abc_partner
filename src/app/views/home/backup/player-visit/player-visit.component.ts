import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { NzModalService } from 'ng-zorro-antd';
import { ToolService } from '../../../../tool/tool.service';

import { saveAs } from 'file-saver';
import { ExcelService } from '../../../../api/excel.service';

@Component({
  selector: 'app-player-visit',
  templateUrl: './player-visit.component.html',
  styleUrls: ['./player-visit.component.scss']
})

export class BackupPlayerVisitComponent implements OnInit {
  public tableList  = [];
  public dateRange  = [];
  public page = {
    index: 1,
    total: 0
  };

  public contentPop = {
    show: false,
    data: ''
  };

  public searchData = {
    page_index: 1,
    page_size: this.api.pageSize + '',
  };

  constructor( public api: ApiService, public utils: ToolService, private modalService: NzModalService,
               private excelService: ExcelService, ) {

  }

  // 初始化
  ngOnInit() {
    this.getDataList();
  }

  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  public resetSearch() {
    this.page.index = 1;
    this.searchData = {
      page_index: 1,
      page_size: this.api.pageSize
    };
    this.dateRange = [];
    this.getDataList();
  }

  public search() {
    this.page.index = 1;
    this.getDataList();
  }

  // 日期选择框
  public onChange(result: Date): void {
    const DATE_ARRAY = [result[0].getTime(), result[1].getTime()];
    const largest = 2592000000;
    const GAP = DATE_ARRAY[1] - DATE_ARRAY[0];
    if (GAP > largest) {
      DATE_ARRAY[0] = DATE_ARRAY[1] - largest;
      const modal = this.modalService.success({
        nzTitle: '温馨提示',
        nzContent: '只能选择区间一个月内的时间!'
      });
      this.dateRange = [new Date(DATE_ARRAY[0]), new Date(DATE_ARRAY[1])];
    }
    this.searchData['start_time']  = this.utils.formatTime(DATE_ARRAY[0], 'YYYY-MM-DD HH:MM:SS');
    this.searchData['end_time']    = this.utils.formatTime(DATE_ARRAY[1], 'YYYY-MM-DD HH:MM:SS');
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

  // 获取数据列表
  public async getDataList() {
    this.searchData.page_index  = this.page.index;

    const response = await this.api.Http({name: 'playerVisit', data: {...this.searchData}});
    const {success, data} = response;
    if (success) {
      this.page.total = data.total;
      this.tableList  = data.data;
    }
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
