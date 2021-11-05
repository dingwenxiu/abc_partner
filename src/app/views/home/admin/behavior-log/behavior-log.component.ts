import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-admin-behavior-log',
  templateUrl: './behavior-log.component.html',
  styleUrls: ['./behavior-log.component.scss']
})
export class BehaviorLogComponent implements OnInit {
  public tableList = [];
  public searchData = {
    partner_admin_user: '',
    route: ''
  };
  public page = {
    index: 1,
    total: 0
  };

  public pop = {
    show: false,
    data: {
      params: {},
      context: {}
    }
  };

  constructor(
    private api: ApiService,
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
    this.api.Http({name: 'adminUserBehaviorList', data}).then((res: any) => {
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
    this.getDataList();
  }

  public doPageChange() {
    this.getDataList();
  }

  public look(item) {
    const data = {
      params: JSON.parse(item.params),
      context: JSON.parse(item.context)
    };
    this.pop = {
      show: true,
      data
    };
  }
}
