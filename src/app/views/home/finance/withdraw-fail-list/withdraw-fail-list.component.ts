import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { NzModalService } from 'ng-zorro-antd';
import {ToolService} from '../../../../tool/tool.service';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-withdraw-fail-list',
  templateUrl: './withdraw-fail-list.component.html',
  styleUrls: ['./withdraw-fail-list.component.scss']
})

export class FinanceWithdrawFailListComponent implements OnInit {
  public tableList = [];
  public dateRange: any;
  public page = {
    index: 1,
    total: 0
  };
  public searchData = {
    page_index: 1,
    page_size: 20
  };

  public requestTime = [];
  public checkTime = [];
  public totalPageAmount: any;
  public totalPageRealAmount: any;
  public totalRealAmount: any;

  public handPop = {
    show: false,
    id: '',
    data: {}
  };

  public detailPop = {
    show: false,
    data: {}
  };
  public bankSignOption = [];
  constructor( public api: ApiService, public toolService: ToolService, private modalService: NzModalService ) {

  }

  // 初始化
  ngOnInit() {
    this.getDataList();
    this.getBankList();
  }

  public doDetail(item) {
    this.detailPop = {
      show: true,
      data: {...item}
    };
  }

  public doHand(item) {
    this.handPop = {
      show: true,
      id: item.id,
      data: {}
    };
  }

  public subHank() {
    this.api.Http({name: 'withdrawCheckProcess', data: {...this.handPop.data}, attach: this.handPop.id + ''}).then((res: any) => {
      const {success} = res;
      if (success) {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '恭喜您, 领取成功 !'
        });
      }
    });
  }


  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  // 获取数据列表
  public getDataList() {
    const data = {};
    Object.assign(data, this.searchData);
    this.api.Http({name: 'withdrawFailList', data, attach: '0'}).then((res: any) => {
      if (res.success) {
        this.page.total           = res.data.total;
        this.totalPageAmount      = res.data.pageTotalAmount;
        this.totalPageRealAmount  = res.data.pageTotalRealAmount;
        this.totalRealAmount      = res.data.totalRealAmount;
        this.tableList            = res.data.data;
      }
    });
  }

  public getBankList() {
    this.api.Http({name: 'playerCardList', data: {page_index: 1, page_size: 1}}).then((res: any) => {
      if (res.success) {
        const signArray = [];
        for (const key in res.data.bank_list) {
          if (key) {
            signArray.push({key, label: res.data.bank_list[key]});
          }
        }
        this.bankSignOption = signArray;
      }
    });
  }

  // 获取数据列表
  public resetSearch() {
    this.searchData = {
      page_index: 1,
      page_size: 20
    };
    this.requestTime = null;
    this.checkTime = null;
    this.getDataList();
  }

  public serach() {
    this.searchData.page_index = 1;
    this.getDataList();
  }

  // 日期选择框
  public onRequestChange(result: Date): void {
    this.searchData['start_request_time'] = this.toolService.formatTime(result[0], 'YYYY-MM-DD HH:MM:SS');
    this.searchData['end_request_time'] = this.toolService.formatTime(result[1], 'YYYY-MM-DD HH:MM:SS');
  }

  // 点击时间选项框
  public requestTimeHandle() {
    this.requestTime = [this.toolService.timeInit(), this.toolService.timeInit('???')];
    this.searchData['start_request_time'] = this.toolService.formatTime(this.dateRange[0], 'YYYY-MM-DD HH:MM:SS');
    this.searchData['end_request_time'] = this.toolService.formatTime(this.dateRange[1], 'YYYY-MM-DD HH:MM:SS');
  }

  // 日期选择框
  public oncCheckChange(result: Date): void {
    this.searchData['start_check_time'] = this.toolService.formatTime(result[0], 'YYYY-MM-DD HH:MM:SS');
    this.searchData['end_check_time'] = this.toolService.formatTime(result[1], 'YYYY-MM-DD HH:MM:SS');
  }

  // 点击时间选项框
  public checkTimeHandle() {
    this.checkTime = [this.toolService.timeInit(), this.toolService.timeInit('???')];
    this.searchData['start_check_time'] = this.toolService.formatTime(this.dateRange[0], 'YYYY-MM-DD HH:MM:SS');
    this.searchData['end_check_time'] = this.toolService.formatTime(this.dateRange[1], 'YYYY-MM-DD HH:MM:SS');
  }
}
