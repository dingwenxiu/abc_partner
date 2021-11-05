import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { NzModalService } from 'ng-zorro-antd';
import { ToolService } from '../../../../tool/tool.service';

@Component({
  selector: 'app-salary-report-list',
  templateUrl: './salary-report-list.component.html',
  styleUrls: ['./salary-report-list.component.scss']
})

export class SalaryReportListComponent implements OnInit {
  public tableList = [];

  public page = {
    index: 1,
    total: 0
  };

  public passwordVisible;

  public sendData = {
    show:false,
    loading:false,
    item:{
      username:'',
      team_real_bet:0,
      self_real_bet:0,
      total_salary:0,
      child_salary:0,
      rate:'',
      self_salary:'',
    },
    data:{
      "ids":[],
      "amount":0,
      'fund_password':'',
    }
  };

  public dateRange = [];
  public searchData = {
    page_index: 1,
    page_size: this.api.pageSize,
    parent_id: '',
    username: '',
    start_day: '',
    end_day: ''
  };

  constructor(
    public api: ApiService,
    public toolService: ToolService,
    private modalService: NzModalService) {
  }

  // 初始化
  ngOnInit() {
    this.getList();
  }

  // 日期选择框
  public timeHandle() {
    this.dateRange = [this.toolService.timeInit(), this.toolService.timeInit('???')];
  }
  public onChange(result: Date): void {
    this.searchData['start_day'] = this.toolService.formatTime(result[0]);
    this.searchData['end_day'] = this.toolService.formatTime(result[1]);
  }
  // 搜索
  public doSearch() {
    this.page.index = 1;
    this.getList();
  }
  // 重置搜索
  public resetSearch() {
    this.page.index = 1;
    this.searchData = {
      page_index: 1,
      page_size: this.api.pageSize,
      parent_id: '',
      username: '',
      start_day: '',
      end_day: ''
    };
    this.dateRange = [];
    this.getList();
    }
  private getList() {
    this.searchData.page_index  = this.page.index;
    this.searchData.page_size   = this.api.pageSize;
    this.api.Http({name: 'salaryReportList', data: this.searchData}).then(async (res: any) => {
      const {data} = res;
      this.tableList  = data.data;
      this.page.total = data.total;
    });
  }

  // 开启发放
  public doSend(item) {
    this.sendData.item = item;
    this.sendData.data.ids.push(item.id);
    this.sendData.data.amount = item.self_salary;

    this.sendData.show = true;
  }

  // 提交
  public doSubmitSend() {
    this.sendData.loading = true;
    this.api.Http({name: 'salaryReportSend', data:this.sendData.data}).then(async (res: any) => {

      const {data} = res;
      if (res.success) {
        this.sendData.show = false;
        this.getList();
      }

      const modal = this.modalService.success({
        nzTitle: '提示',
        nzContent: '保存成功 !'
      });

      this.sendData.loading = false;
    }, () => {
      this.sendData.loading = false;
    });
  }

  // 页面变更
  public doPageChange() {
    this.getList();
  }
}
