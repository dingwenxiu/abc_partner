import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { NzModalService } from 'ng-zorro-antd';
import { ToolService } from '../../../../tool/tool.service';
import { saveAs } from 'file-saver';
import { ExcelService } from '../../../../api/excel.service';

@Component({
  selector: 'app-report-stat-user-list',
  templateUrl: './report-stat-user-list.component.html',
  styleUrls: ['./report-stat-user-list.component.scss']
})

export class ReportStatUserListComponent implements OnInit {
  public tableList = [];
  public isShowPrivate = true;

  public page = {
    index: 1,
    total: 0,
    totalPage: 0,
    selectedTotalPage: false
  };

  public searchData = {
    page_index: 1,
    page_size: this.api.pageSize,
    user_id: '',
    parent_id: '',
    username: ''
  };

  public exportPop = {
    show: false,
    loading: false
  };
  public stat = {};
  constructor( public api: ApiService, public utils: ToolService, private modalService: NzModalService,
               private excelService: ExcelService ) {

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
      page_size: this.api.pageSize,
      user_id: '',
      parent_id: '',
      username: ''
    };

    this.getDataList();
  }

  public search() {
    this.page.index = 1;
    this.getDataList();
  }

  // 获取数据列表
  public async getDataList() {
    this.searchData.page_index  = this.page.index;
    this.searchData.page_size   = this.api.pageSize;

    const response = await this.api.Http({name: 'statUserList', data: {...this.searchData}});
    if (response.success) {
      this.page.total = response.data.total;
      this.tableList = response.data.data;
      this.page.totalPage = response.data.totalPage;
      this.stat = response.data.stat;
    }
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
      用户名: data.username,
      充值: data.recharge_amount,
      提现: data.withdraw_amount,
      理赔: data.system_transfer_add,
      扣减: data.system_transfer_reduce,
      投注: data.bets,
      撤单: data.cancel,
      中奖: data.bonus,
      返点: data.commission,
      转入: data.transfer_from_parent,
      转出: data.transfer_to_child,
      礼金: data.gift,
      工资: data.salary,
      分红: data.dividend,
      积分: data.score,
      亏损: data.profit
    };
  }

  private exportNowPage() {
    this.exportPage(this.tableList, '用户总结算');
  }

  public async exportAllPage() {
    this.page.selectedTotalPage = true;
    this.exportPop.loading = true;
    const exportExcel = [];
    for (let i = 1; this.page.selectedTotalPage ; i++) {
      const response = await this.api.Http({
        name: 'statUserList',
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
      if ( (!((i * 2000) % 100000) || !data.data.length) || !this.page.selectedTotalPage) {
        this.exportPage(exportExcel, `用户总结算-${i}`);
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
}
