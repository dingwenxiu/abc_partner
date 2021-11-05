import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-admin-player-ip-log',
  templateUrl: './player-ip-log.component.html',
  styleUrls: ['./player-ip-log.component.scss']
})
export class AdminUserIpLogComponent implements OnInit {
  public page = {
    index: '1',
    size: null,
    total: '1'
  };

  public detailPop = {
    show: false,
    data: {}
  };

  public tableList = [];

  public searchData = {};
  constructor(
    public utils: ToolService,
    public api: ApiService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.getDataList();
  }

  private getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.page.size || this.api.pageSize,
    };
    Object.assign(data, this.searchData);
    this.api.Http({name: 'userIpLogList', data}).then((res: any) => {
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
      size: 20,
      total: '0'
    };
    this.getDataList();
  }
}
