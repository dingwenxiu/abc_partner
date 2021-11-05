import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ToolService } from '../../../../tool/tool.service';

@Component({
  selector: 'app-dividend-report-list',
  templateUrl: './dividend-report-list.component.html',
  styleUrls: ['./dividend-report-list.component.scss']
})

export class DividendReportListComponent implements OnInit {
  public tableList = [];

  public page = {
    index: 1,
    total: 0
  };

  public passwordVisible = false;
  // 时间
  public dateRange = [];
  public sendData = {
    show: false,
    loading: false,
    type: 'single',
    item: {
      username: '',
      profit: 0.0,
      rate: 0.0,
      amount: 0.0,
    },
    data: {
      ids: [],
      amount: 0,
      fund_password: '',
    }
  };

  public searchData = {
    page_index: 1,
    page_size: this.api.pageSize,
    parent_id: '',
    username: '',
    start_day: '',
    end_day: ''
  };

  public sendIdList = [];

  public checkedAll = false;
  public checked = [];
  public indeterminate: boolean;

  constructor(
    public api: ApiService, public toolService: ToolService, private modalService: NzModalService, public message: NzMessageService, ) {

  }

  // 初始化
  ngOnInit() {
    this.getList();
  }

  public sendCheckedAll($event) {
    if ($event) {
      this.tableList.forEach((value, index) => {
        this.checked[index] = true;
        this.sendIdList.push(value.id);
      });
    } else {
      this.checked = [];
      this.sendIdList = [];
    }
    this.indeterminate = false;
  }

  public sendChecked($event, id) {
    if ($event) {
      this.sendIdList.push(id);
      this.indeterminate = true;
    } else {
      const index = this.sendIdList.indexOf(id);
      if (index !== -1) { this.sendIdList.splice(index, 1); }
    }
  }

  public sendAll() {
    this.sendData.type = 'mass';
    this.sendData.data.fund_password = '';
    this.sendData.data.ids = [...this.sendIdList];
    this.sendData.show = true;
  }

  // 日期选择框
  public timeHandle() {
    this.dateRange = [this.toolService.timeInit(), this.toolService.timeInit('???')];
  }
  public onChange(result: Date): void {
    this.searchData.start_day = this.toolService.formatTime(result[0]);
    this.searchData.end_day = this.toolService.formatTime(result[1]);
  }
  // 搜索
  public doSearch() {
    this.page.index = 1;
    this.getList();
  }
  // 获取列表
  private getList() {
    this.searchData.page_index  = this.page.index;
    this.searchData.page_size   = this.api.pageSize;
    this.api.Http({name: 'dividendReportList', data: this.searchData}).then(async (res: any) => {
      const {data} = res;
      this.tableList  = data.data;
      this.page.total = data.total;
    });
  }

  // 开启发放
  public doSend(item: any) {
    this.sendData.data.fund_password = '';
    this.sendData.type = 'single';
    this.sendData.item = item;
    this.sendData.data.ids = [item.id];
    this.sendData.data.amount = item.amount;
    this.sendData.show = true;
  }

  // 提交
  public doSubmitSend() {
    this.sendData.loading = true;
    const option = {...this.sendData.data};
    this.api.Http({name: 'dividendReportSend', data: option}).then(async (res: any) => {

      const {data} = res;
      if (res.success) {
        this.sendData.show = false;
        this.sendData.data = {
          ids: [],
          amount: 0,
          fund_password: ''
        };
        this.getList();
        this.message.create('success', res.msg);
      }

      this.sendData.loading = false;
    }, () => {
      this.sendData.loading = false;
    });
  }

  // 重置搜索
  public resetSearch() {
    this.page.index = 1;
    this.dateRange = [];
    this.searchData = {
      page_index: 1,
      page_size: this.api.pageSize,
      parent_id: '',
      username: '',
      start_day: '',
      end_day: ''
    };
    this.getList();
  }

  // 页面变更
  public doPageChange() {
    this.getList();
  }
}
