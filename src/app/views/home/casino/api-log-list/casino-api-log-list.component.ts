import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-casino-api-log-list',
  templateUrl: './casino-api-log-list.component.html',
  styleUrls: ['./casino-api-log-list.component.scss']
})
export class CasinoApiLogListComponent implements OnInit {
  public tableList = [];
  public seriesId = 'ssc';
  public seriesList = {};
  public selectedValue: any;
  public searchData = {};
  public page = {
    index: 1,
    total: 0
  };
  public detailPop = {
    show: false,
    data: {
      api: '',
      call_url: '',
      created_at: '',
      from: '',
      id: '',
      params: '',
      return_content: '',
      updated_at: '',
      user_id: '',
      username: ''
    }
  };

  public editClear = null;

  constructor(
    public utils: ToolService,
    public api: ApiService,
    public router: Router,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getDataList();
  }

  public selectTab(seriesId) {
    this.seriesId = seriesId;
    this.getDataList();
  }

  public getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
    };

    this.api.Http({name: 'getApiLog', data}).then((res: any) => {
      if (res && res.success) {
        this.tableList = res.data.data;
        this.seriesList = res.data.seriesList;
        this.page.total = res.data.total;
      }
    });
  }

  public pageChange() {
    this.getDataList();
  }

  public detail(data: any) {
    this.detailPop.show = true;
    this.detailPop.data = data;
  }

  public doPageChange() {
    this.getDataList();
  }
}
