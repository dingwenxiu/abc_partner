import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { NzModalService } from 'ng-zorro-antd';
import { ToolService } from '../../../../tool/tool.service';

import { saveAs } from 'file-saver';
import { ExcelService } from '../../../../api/excel.service';
@Component({
  selector: 'app-report-lottery-day-list',
  templateUrl: './report-lottery-day-list.component.html',
  styleUrls: ['./report-lottery-day-list.component.scss']
})

export class ReportLotteryDayListComponent implements OnInit {

  public exportPop = {
    show: false,
    loading: false
  };

  constructor( public api: ApiService, private modalService: NzModalService, public utils: ToolService,
               private excelService: ExcelService) {}

  public lotteryOption = {};

  public searchData = {
    page_index: 1,
    page_size: 15,
    lottery_sign: '',
    room_id: '',
    start_day: '',
    end_day: ''
  };

  public defaultSelect = '所有系列';
  public dateRange = [];
  public tableList = [];
  public page = {
    index: 1,
    total: 0,
    totalPage: 0,
    selectedTotalPage: false
  };

  // 合计
  public combined = {}

  public pageStat = {};
  public totalStat = {};

  ngOnInit() {
    const yestoday = new Date(new Date().getTime() - 86400 * 1000);
    this.searchData.start_day = this.utils.formatTime(yestoday, 'YYYYMMDD');
    this.searchData.end_day   = this.utils.formatTime(yestoday, 'YYYYMMDD');
    this.dateRange = [yestoday, yestoday];
    this.getDataList();
  }

  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  // 日期选择框
  public onChange(result: Date): void {
    this.searchData['start_day'] = this.utils.formatTime(result[0], 'YYYYMMDD');
    this.searchData['end_day'] = this.utils.formatTime(result[1], 'YYYYMMDD');
  }

  // 搜索
  public resetSearch() {
    this.page.index = 1;
    this.searchData = {
      page_index: 1,
      page_size: this.api.pageSize,
      lottery_sign: '',
      room_id: '',
      start_day: '',
      end_day: ''
    };
    this.dateRange = [];
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

    const response = await this.api.Http({name: 'lotteryDayList', data: {...this.searchData}});
    if (response.success) {
      this.page.total = response.data.total;
      this.tableList = response.data.data;
      this.lotteryOption  = response.data.lottery_option;
      this.page.totalPage = response.data.totalPage;
      this.totalStat = response.data.total_stat;
      this.pageStat = response.data.page_stat;
    }
  }

  // 选
  public doSelectLottery(event) {
    this.searchData.lottery_sign = event[1];
    this.getDataList();
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
      游戏: data.lottery_name,
      日期: data.day,
      投注: data.bets,
      单挑扣除: data.challenge_reduce,
      限额扣除: data.limit_reduce,
      撤单: data.bonus,
      和反: data.he_return,
      下级返点: data.cancel,
      投注返点: data.commission_from_child,
      盈亏: data.commission_from_bet
    };
  }

  private exportNowPage() {
    this.exportPage(this.tableList, '彩种日结算');
  }

  public async exportAllPage() {
    this.page.selectedTotalPage = true;
    this.exportPop.loading = true;
    const exportExcel = [];
    for (let i = 1; this.page.selectedTotalPage ; i++) {
      const response = await this.api.Http({
        name: 'lotteryDayList',
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
        this.exportPage(exportExcel, `彩种日结算-${i}`);
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
