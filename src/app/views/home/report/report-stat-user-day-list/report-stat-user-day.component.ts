import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { ToolService } from '../../../../tool/tool.service';
import { NzModalService } from 'ng-zorro-antd';
import { saveAs } from 'file-saver';
import { ExcelService } from '../../../../api/excel.service';
@Component({
  selector: 'app-report-stat-user-day',
  templateUrl: './report-stat-user-day.component.html',
  styleUrls: ['./report-stat-user-day.component.scss']
})

export class ReportStatUserDayComponent implements OnInit {

  public isShowPrivate = '1';
  public dateRange = [];
  public searchData = {
    page_index: 1,
    page_size: 15,
    user_id: '',
    username: '',
    start_day: '',
    end_day: ''
  };

  public tableList = [];
  public page = {
    index: 1,
    total: 0,
    totalPage: 0,
    selectedTotalPage: false
  };

  public checkData = {
    show: false,
    data: []
  };

  public exportPop = {
    show: false,
    loading: false
  };
  public dataToal: {};

  constructor(
    public api: ApiService,
    public utils: ToolService,
    private modalService: NzModalService,
    private excelService: ExcelService, ) {

  }

  // 初始化
  ngOnInit() {
    const date = new Date();
    this.searchData.start_day = this.utils.formatTime(date, 'YYYYMMDD');
    this.searchData.end_day   = this.utils.formatTime(date, 'YYYYMMDD');
    this.getDataList();
  }

  // 检测
  check(id: any) {
    this.api.Http({name: 'statUserDayCheck', data: {}, attach:id}).then((res: any) => {
      if (res.success) {
        this.checkData.show   = true;
        this.checkData.data   = res.data;
      }
    });
  }

  // 回退
  public back() {
    this.checkData.show       = false;
  }

  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  // 日期选择框
  // public onChange(result: Date): void {
  //   const {time1, time2} = this.utils.timeIsNow(result);
  //   const newTime1 = time1 ? this.utils.timeToZero(result[0]) : result[0];
  //   const newTime2 = time2 ? this.utils.timeToZero(result[1]) : result[1];
  //   this.searchData['start_time'] = this.utils.formatTime(new Date(newTime1).getTime(), 'YYYY-MM-DD HH:MM:SS');
  //   this.searchData['end_time'] = this.utils.formatTime(new Date(newTime2).getTime(), 'YYYY-MM-DD HH:MM:SS');
  //   this.searchData['start_day'] = [new Date(newTime1), new Date(newTime2)];
  // }

  // 日期选择框
  public onChange(result: Date): void {
    // const {time1, time2} = this.utils.timeIsNow(result);
    // const newTime1 = time1 ? this.utils.timeToZero(result[0]) : result[0];
    // const newTime2 = time2 ? this.utils.timeToZero(result[1]) : result[1];
    // this.searchData['start_time'] = this.utils.formatTime(new Date(newTime1).getTime(), 'YYYY-MM-DD HH:MM:SS');
    // this.searchData['end_time'] = this.utils.formatTime(new Date(newTime2).getTime(), 'YYYY-MM-DD HH:MM:SS');
    // this.dateRange = [new Date(newTime1), new Date(newTime2)];
    this.searchData['start_day'] = this.utils.formatTime(result[0], 'YYYYMMDD');
    this.searchData['end_day'] = this.utils.formatTime(result[1], 'YYYYMMDD');
  }

  // // 点击时间选项框
  // public timeHandle() {
  //   this.searchData['start_day'] = [this.utils.timeInit(), this.utils.timeInit()];
  // }

  public resetSearch() {
    this.page.index = 1;
    this.searchData = {
      page_index: 1,
      page_size: this.api.pageSize,
      user_id: '',
      username: '',
      start_day: '',
      end_day: ''
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

    const response = await this.api.Http({name: 'statUserDayList', data: {...this.searchData}});
    if (response.success) {
      this.page.total = response.data.total;
      this.tableList = response.data.data;
      this.dataToal = response.data.dataToal;
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
    return this.isShowPrivate === '2' ? {
      日期: data.day,
      用户名: data.username,
      '充值(团)': data.team_recharge_amount,
      '提现(团)': data.team_withdraw_amount,
      '理赔(团)': data.team_system_transfer_add,
      '扣减(团)': data.team_system_transfer_reduce,
      '投注(团)': data.team_bets,
      '撤单(团)': data.team_cancel,
      '中奖(团)': data.team_bonus,
      '投返(团)': data.team_commission_from_bet,
      '下返(团)': data.team_commission_from_child,
      '转入(团)': '---',
      '转出(团)': '---',
      '礼金(团)': data.team_gift,
      '工资(团)': '---',
      '分红(团)': '---',
      '积分(团)': data.team_score,
      '盈亏(团)': data.team_profit
    } : {
      日期: data.day,
      用户名: data.username,
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
      盈亏: data.profit
    };
  }

  private exportNowPage() {
    this.exportPage(this.tableList, `用户日结算${this.isShowPrivate === '2' ? '(团)' : ''}`);
  }

  public async exportAllPage() {
    this.page.selectedTotalPage = true;
    this.exportPop.loading = true;
    const exportExcel = [];
    for (let i = 1; this.page.selectedTotalPage ; i++) {
      const response = await this.api.Http({
        name: 'statUserDayList',
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
        this.exportPage(exportExcel, `用户日结算-${i}`);
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
