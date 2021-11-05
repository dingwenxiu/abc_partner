import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-casino-transfer-log-list',
  templateUrl: './casino-transfer-log-list.component.html',
  styleUrls: ['./casino-transfer-log-list.component.scss']
})

export class CasinoTransferLogListComponent implements OnInit {
  public tableList    = [];
  public seriesId     = 'ssc';
  public seriesList   = {};
  public selectedValue: any;
  public searchData = {};
  public addTopData = {
    show: false,
    data: {
      username: '',
      password: '',
      fund_password: '',
      prize_group: '',
      is_test: ''
    }
  };
  public fund = {
    show: false,
    username: '',
    balance: '',
    transfer_add_options: [],
    transfer_reduce_options: [],
    fundSubmitButton: false,
    add_data: {
      amount: '',
      password: '',
      reason: '',
      type: ''
    },
    reduce_data: {
      type: '',
      amount: '',
      password: '',
      reason: '',
    }
  };
  public frozen = {
    show: false,
    username: '',
    current_frozen: '',
    frozen_options: '',
    data: {
      frozen: '',
      password: '',
      reason: '',
    }
  };
  public password = {
    show: false,
    login_data: {
      password: '',
      confirm_password: '',
      reason: '',
    },
    fund_data: {
      password: '',
      confirm_password: '',
      reason: '',
    },
    submitButton: false,
    id: '',
    username: '',
    nickname: '',
  };
  public page = {
    index: 1,
    total: 0
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

  public selectTab(seriesId) {
    this.seriesId = seriesId;
    this.getDataList();
  }

  public getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: 15,
      pid: 0,
      lottery_id: this.selectedValue,
      series_id: this.seriesId
    };

    this.api.Http({name: 'getTransfer', data}).then((res: any) => {
      if (res && res.success) {
        this.edit.series_options = res.data.series_options;
        this.tableList = res.data.data;
        this.seriesList = res.data.seriesList;
        this.edit.series_options = res.data.seriesList;
      }
    });
  }

  public doPageChange() {
    this.getDataList();
  }

  public back() {
    this.edit.show = false;
    this.edit.data = JSON.parse(this.editClear).data;
    this.getDataList();
  }
  public submitAddTop() {}
  public submitTransfer(type) {}
  public submitFrozen() {}
  public submitPassword(type) {}
}
