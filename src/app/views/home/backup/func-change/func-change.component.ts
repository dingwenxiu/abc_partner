import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { NzModalService } from 'ng-zorro-antd';
import { ToolService } from '../../../../tool/tool.service';

import { saveAs } from 'file-saver';
import { ExcelService } from '../../../../api/excel.service';

@Component({
  selector: 'app-func-change',
  templateUrl: './func-change.component.html',
  styleUrls: ['./func-change.component.scss']
})

export class BackupFuncChangeComponent implements OnInit {
  public tableList  = [];
  public dateRange  = [];
  public typeOption = [];

  // 订单详情
  public projectData = {
    show: false,
    data: [],
  };

  public page = {
    index: 1,
    total: 0,
    totalPage: 0,
    selectedTotalPage: false
  };

  public userSearch = '1';

  public searchData = {
    page_index: 1,
    page_size: this.api.pageSize + '',
  };

  // 返点数据
  public commissionData = {
    show: false,
    page: {
      index: 1,
      total: 0
    },
    search: {
      page_index: 1,
      page_size: this.api.pageSize,
      account_change_id: 0,
      lottery_sign: '',
      issue: '',
    },
    data: []
  };

  public exportPop = {
    show: false,
    loading: false
  };

  public adminList = [];
  public agentList = [];
  public defaultSelect = '所有系列';
  public lotteryOption = [];

  constructor( public api: ApiService, public utils: ToolService, private modalService: NzModalService,
               private excelService: ExcelService, ) {

  }

  // 初始化
  ngOnInit() {
    this.getDataList();
    this.getaAdminist();
    this.getLotteryOption();
  }

  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  // 页面变更
  public commissionDataPageChange() {
    this.getCommissionData();
  }

  public resetSearch() {
    this.page.index = 1;
    this.searchData = {
      page_index: 1,
      page_size: this.api.pageSize
    };
    this.defaultSelect = '所有系列';
    this.dateRange = [];
    this.getDataList();
  }

  public search() {
    this.page.index = 1;
    if (this.searchData['agent_top']) {
      if (this.userSearch) {
        for (const item of this.agentList) {
          if (+item.user_id === +this.searchData['top_id']) {
            this.searchData['rid'] = item.rid;
          }
        }
        delete this.searchData['user_id'];
        delete this.searchData['parent_id'];
      } else {
        delete this.searchData['top_id'];
        this.searchData['parent_id'] = this.searchData['user_id'];
      }
    }
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

    const response = await this.api.Http({name: 'funcChange', data: {...this.searchData}});
    const {success, data} = response;
    if (success) {
      this.page.total = data.total;
      this.typeOption = data.type_options;
      this.page.totalPage = data.totalPage;
      if (response.data.agent instanceof Array) {
        this.agentList = [...data.agent];
      }
      data.data.map((item) => {
        for (const key in item) {
          if (item[key] + '' === '0') {
            item[key] = ' ';
          }
        }
      });
      this.tableList  = data.data;
    }
  }

  public doShowProjectDetail(id) {
    this.api.Http({ name: 'projectDetail', attach: id}).then((res: any) => {
      if (res.success) {
        this.projectData.data       = res.data;
        this.projectData.show       = true;
      } else {

      }
    });
  }

  // 查看注单详情
  public doShowCommissionDetail(id) {
    this.commissionData.search.account_change_id = id;
    this.getCommissionData();
  }

  public getCommissionData() {
    this.commissionData.search.page_index  = this.commissionData.page.index;
    this.commissionData.search.page_size   = this.api.pageSize;

    this.api.Http({ name: 'commissionList', data: this.commissionData.search}).then((res: any) => {
      if (res.success) {
        this.commissionData.page.total  = res.data.total;
        this.commissionData.data        = res.data.data;
        this.commissionData.show        = true;
      }
    });
  }

  public async export(type) {
    if (type) {
      this.exportPop = {
        show: true,
        loading: false
      };
    } else {
      this.exportNowPage();
    }
  }

  private exportPage(tableData, fileName) {
    const logListArray = [];
    const tableList = tableData;
    for (const data of tableList) {
      logListArray.push(this.formatListXlsx(data));
    }
    this.excelService.exportAsExcelFile(logListArray, fileName);
  }

  private formatListXlsx(data) {
    return {
      ID: data.id,
      用户ID: data.user_id,
      用户名: data.username,
      账变: data.type_name,
      金额: data.amount,
      彩种: data.lottery_name,
      玩法: data.method_name,
      注单: data.project_id,
      关联用户: data.related_id,
      发前余额: data.before_balance,
      余额: data.balance,
      流动: data.type_flow,
      冻结前: data.before_frozen_balance,
      冻结后: data.frozen_balance,
      活动: data.activity_sign,
      时间: data.created_at
    };
  }

  private exportNowPage() {
    this.exportPage(this.tableList, '账变列表');
  }

  public async exportAllPage() {
    this.page.selectedTotalPage = true;
    this.exportPop.loading = true;
    const exportExcel = [];
    for (let i = 1; this.page.selectedTotalPage ; i++) {
      const response = await this.api.Http({
        name: 'accountChangeList',
        data: {
          ...this.searchData,
          page_size: 2000,
          page_index: i
        }
      });
      const {data, success} = response;
      if (success) {
        exportExcel.push(...data.data);
      }
      if ( (!((i * 2000) % 100000) || !data.data.length)  || !this.page.selectedTotalPage) {
        this.exportPage(exportExcel, `账变列表-${i}`);
      }
      if (!data.data.length) {
        break;
      }
    }
    this.exportPop = {
      show: false,
      loading: false
    };
    this.modalService.success({
      nzTitle: '温馨提示',
      nzContent: `下载完成`
    });
  }

  public stopDownload() {
    this.page.selectedTotalPage = false;
    this.exportPop.loading = false;
  }

  // 获取数据列表
  public getaAdminist() {
    this.api.Http({
      name: 'adminUserList'
    }).then((res: any) => {
      if (res.success) {
        this.adminList = res.data.data;
      }
    });
  }

  // 选
  public doSelectLottery(event) {
    this.searchData['lottery_sign'] = event[1];
  }

  // 获取数据列表
  public async getLotteryOption() {
    const response = await this.api.Http({name: 'lotteryDayList'});
    if (response.success) {
      this.lotteryOption  = response.data.lottery_option;
    }
  }
}
