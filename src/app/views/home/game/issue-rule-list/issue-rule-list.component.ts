import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-issue-rule-list',
  templateUrl: './issue-rule-list.component.html',
  styleUrls: ['./issue-rule-list.component.scss']
})

export class IssueRuleListComponent implements OnInit {
  public tableList = [];
  public selectedValue: any;
  public defaultSelect: any;
  public lottery_options = [];

  public page = {
    index: 1,
    total: 0
  };

  public edit = {
    show: false,
    id: 0,
    series_options: {},
    data: {
      lottery_id: null,
      begin_time: null,
      end_time: null,
      issue_seconds: null,
      first_time: null,
      adjust_time: null,
      encode_time: null,
      issue_count: null
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
    this.editClear = JSON.stringify(this.edit);
  }

  public getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
      pid: 0,
      lottery_sign: this.selectedValue
    };
    this.api.Http({name: 'issueRuleList', data}).then((res: any) => {
      if (res.success) {
        this.page.total = res.data.total;
        this.tableList  = res.data.data;
        const cascader = [];
        const options = res.data.lottery_options;
        this.lottery_options   = options;
      }
    });
  }

  public pageChange() {
    this.getDataList();
  }

  public editHandler(item: any) {
    this.edit.data.lottery_id = item.lottery_id;
    this.edit.data.issue_seconds = item.issue_seconds;
    this.edit.data.adjust_time = item.adjust_time;
    this.edit.data.encode_time = item.encode_time;
    this.edit.data.issue_count = item.issue_count;
    this.edit.show = true;
  }

  public back() {
    this.edit.show = false;
    this.edit.data = JSON.parse(this.editClear).data;
    this.getDataList();
  }

  // 选
  public doSelectLottery(event) {
    this.selectedValue = event[event.length - 1 ];
    this.getDataList();
  }
}
