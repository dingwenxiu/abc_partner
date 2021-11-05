import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-casino-method-list',
  templateUrl: './casino-method-list.component.html',
  styleUrls: ['./casino-method-list.component.scss']
})
export class CasinoMethodListComponent implements OnInit {
  public tableList = [];
  public seriesId = 'ssc';
  public seriesList = {};
  public selectedValue: any;
  public searchData = {
    status:'',
    cn_name: '',
    page_size: null,
    main_game_plat_code: null,
    category: null,
  };
  public optionsData = {
    plat_form: [],
    categories: []
  };
  public timeCoulDown = false;

  public page = {
    index: 1,
    total: 0
  };

  public detailPop = {
    show: false,
    data: {
      able_demo: '',
      able_recommend: '',
      created_at: '',
      add_admin_id: '',
      bonus_pool: '',
      category: '',
      cn_name: '',
      en_name: '',
      home: '',
      id: '',
      img: '',
      line_num: '',
      main_game_plat_code: '',
      mobile_game_code: '',
      mobile_game_deputy_code: '',
      pc_game_code: '',
      pc_game_deputy_code: '',
      record_match_code: '',
      record_match_deputy_code: '',
      status: '',
      type: '',
      updated_at: ''
    }
  };

  public edit = {
    show: false,
    submitButton: false,
    id: 0,
    series_options: {},
    valid_code: {},
    checkOptionsOne: [],
    positions: [],
    data: {
      lottery_name: '',
      lottery_sign: '',
      series_id: '',
      max_trace_number: '',
      issue_format: '',
      is_fast: false,
      auto_open: false,
      day_issue: '',
      issue_type: '',
      valid_code: '',
      code_length: '',
      positions: '',
      diff_prize_group: '',
      max_prize_per_code: '',
      max_prize_per_issue: '',
      max_prize_group: '',
      min_prize_group: '',
      valid_modes: '',
    }
  };
  public editClear = null;

  public imgBool = [];

  constructor(
    public utils: ToolService,
    public api: ApiService,
    public router: Router,
    private modalService: NzModalService,
    public message: NzMessageService
  ) { }

  ngOnInit() {
    this.getDataList();
    this.editClear = JSON.stringify(this.edit);
    this.getOptionsData();
  }

  // 日期选择框
  public onChange(result: Date): void {
    this.searchData['start_time']  = this.utils.formatTime(new Date(result[0]).getTime(), 'YYYY-MM-DD HH:MM:SS');
    this.searchData['end_time']    = this.utils.formatTime(new Date(result[1]).getTime(), 'YYYY-MM-DD HH:MM:SS');
  }

  public selectTab(seriesId) {
    this.seriesId = seriesId;
    this.getDataList();
  }

  public getDataList(reset = false) {
    const set = reset && (this.searchData = {
      status: '',
      cn_name: '',
      page_size: null,
      main_game_plat_code: null,
      category: null,
    });
    const data = {
      ...this.searchData,
      page_index: this.page.index,
      page_size: this.searchData.page_size || this.api.pageSize
    };

    this.api.Http({name: 'getGameList', data}).then((res: any) => {
      if (res && res.success) {
        this.edit.series_options = res.data.series_options;
        this.tableList = res.data.data;
        this.seriesList = res.data.seriesList;
        this.edit.series_options = res.data.seriesList;
        this.page.total = res.data.total;
      }
    });
  }

  public getOptionsData() {
    this.api.Http({
      name: 'getPlatType'
    }).then((res: any) => {
      if (res && res.success) {
        this.optionsData = {...res.data};
      }
    });
  }

  public pageChange() {
    this.getDataList();
  }

  public back() {
    this.edit.show = false;
    this.edit.data = JSON.parse(this.editClear).data;
    this.getDataList();
  }

  public detail(data: any) {
    this.detailPop.show = true;
    this.detailPop.data = data;
  }

  public setGameStatus($event, id, index) {
    let flag = $event;
    this.api.Http({name: 'gameControl', data: {id}}).then((res: any) => {
      if (res.success) {
        this.message.success(res.msg);
      } else {
        flag = !flag;
      }
    }).finally(() => {
      this.tableList[index].status = flag;
    });
  }

  public SynchronousData() {
    this.timeCoulDown = true;
    this.api.Http({name: 'callGameList'}).then((res: any) => {
      let timeCat = 300;
      const timer = setInterval(() => {
        timeCat-- >= 0 ? '' : this.timeCoulDown = false;
      }, 1000);
      this.getDataList();
    });
  }

  public doPageChange() {
    this.getDataList();
  }

  public dateRange() {

  }

  // 上传图片
  public upImage(e: any, index) {
    if (e.type === 'success' && e.fileList[0].response.success) {
      this.tableList[index].img = e.fileList[0].response.data.path;
    }
  }

  // 删除图片
  public delete(item, index) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确定要删除吗？</b>',
      nzOnOk: async () => {
        this.api.Http({name: 'casinoGameImgDelete', data: {id: item.id}}).then((res) => {
          if (res.success) {
            const modal = this.modalService.success({
              nzTitle: '温馨提示',
              nzContent: res.msg
            });
            this.tableList[index].img = '';
          }
        });
      }
    });
  }

  public testOut() {
    console.log('123');
  }
}
