import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { NzModalService } from 'ng-zorro-antd';
import { ToolService } from '../../../../tool/tool.service';
import { saveAs } from 'file-saver';
import { ExcelService } from '../../../../api/excel.service';

@Component({
  selector: 'app-profit-and-loss-report',
  templateUrl: './profit-and-loss-report.component.html',
  styleUrls: ['./profit-and-loss-report.component.scss']
})

export class ProfitAndLossReportComponent implements OnInit {
  public tableList = [];
  public isShowPrivate = '1';
  public page = {
    index: 1,
    total: 0,
    totalPage: {},
    selectedTotalPage: false
  };

  public searchData = {
    page_index: 1,
    page_size: this.api.pageSize
  };

  public exportPop = {
    show: false,
    loading: false
  };
  public totalPage = {};
  public profitData = {};
  public dateRange: Date;
  constructor( public api: ApiService, public utils: ToolService, private modalService: NzModalService,
               private excelService: ExcelService ) {

  }

  // 初始化
  ngOnInit() {
    this.api.getTime().then( res => {
      const timestamp = res['data'];
      this.getTimeS(timestamp);
      this.dateRange = new Date(timestamp);
    });
    this.getDataList();
  }

  private getTimeS(date) {
    const nowDate = new Date(date);
    const [year, month] = [nowDate.getFullYear(), nowDate.getMonth() + 1];
    const addDate = new Date(year, month, 0);
    this.searchData['start_time'] = `${year}-${month}-01`;
    this.searchData['end_time'] = `${year}-${month}-${addDate.getDate()}`;
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
    this.dateRange = null;
    this.getDataList();
  }

  public search() {
    this.page.index = 1;
    this.getDataList();
  }

  // 获取数据列表
  public async getDataList() {
    // this.searchData.page_index  = this.page.index;
    // this.searchData.page_size   = this.api.pageSize;

    const response = await this.api.Http({name: 'getDailyStatistical', data: {...this.searchData}});
    if (response.success) {
      const data = response.data.data;
      this.page.total = data.length;
      this.tableList = data;
      this.totalPage = response.data;
    }
  }

  // 日期选择框
  public onChange(result: Date): void {
    console.log(result);
    this.getTimeS(result);
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
      日期: data.day,
      总代注册人数: data.team_first_register,
      注册人数: data.first_register,
      首充人数: data.first_recharge_count,
      充值人数: data.repeat_recharge_count,
      提现人数: data.withdraw_amount,
      投注人数: data.have_bet,
      充值: data.recharge_amount,
      提现: data.withdraw_amount,
      理赔: data.system_transfer_add,
      扣减: data.system_transfer_reduce,
      投注: data.bets,
      撤单: data.cancel,
      中奖: data.bonus,
      投返: data.commission_from_bet,
      下返: data.commission_from_child,
      转入: data.transfer_from_parent,
      转出: data.transfer_to_child,
      礼金: data.gift,
      工资: data.salary,
      分红: data.dividend,
      积分: data.score,
      盈亏: data.profit,
    };
  }

  private exportNowPage() {
    this.exportPage(this.tableList, '盈亏报表');
  }

  public async exportAllPage() {
    this.page.selectedTotalPage = true;
    this.exportPop.loading = true;
    const exportExcel = [];
    for (let i = 1; this.page.selectedTotalPage ; i++) {
      const response = await this.api.Http({
        name: 'getDailyStatistical',
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
        this.exportPage(exportExcel, `盈亏报表-${i}`);
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

  public financial(x) {
    return Number.parseFloat(x).toFixed(2);
  }
}
