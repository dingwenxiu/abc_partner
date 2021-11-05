import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { ToolService } from '../../../../tool/tool.service';

import { NzMessageService, NzModalService } from 'ng-zorro-antd';
@Component({
  selector: 'app-activity-log-list',
  templateUrl: './activity-log-list.component.html',
  styleUrls: ['./activity-log-list.component.scss']
})
export class ActivityLogListComponent implements OnInit {
  public tableList = [];
  public page = {
    index: 1,
    total: 0
  };

  public prizeType = {
    1: '礼金',
    2: '积分',
    3: '钱',
  };

  public possibleType = {
    1: '投注'
  };

  public obtainType = {
    1: '即时赠送',
    2: '次日发放',
    3: '客服赠送'
  };

  public statusType = {
    1: '已领取',
    2: '未领取',
    3: '已拒绝',
    4: '次日发放失败',
    5: '客服拒绝发放',
    6: '审核'
  };

  public searchData = {
    check: '',
    prize: '',
    status: '',
    type: '',
    startTime: '',
    endTime: '',
    admin_name: '',
    obtain_type: ''
  };
  public checkTime = null;
  // 审核
  public check = {
    show: false,
    data: {}
  };

  public serachOptions = {
    check: {},
    prize: {},
    status: {},
    type: [],
    obtain_type: []
  };

  constructor(
    public api: ApiService,
    public message: NzMessageService,
    public modalService: NzModalService,
    public toolService: ToolService
  ) { }

  async ngOnInit() {
    this.getDataList();
    const res = await this.api.Http({ name: 'getParams' });
    const { success, data } = res;
    if (success) {
      this.serachOptions = data;
    }
  }
  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  // 获取数据列表
  public async getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
    };
    Object.assign(data, this.searchData);
    const res = await this.api.Http({ name: 'checkGetLists', data });
    if (res.success) {
      this.page.total = res.data.total;
      this.tableList = res.data.data;
    }
  }

  // 去审核
  public goCheck(item: any) {
    this.check.data = {};
    this.check.data['id'] = item.id;
    this.check.data['check_status'] = 6;
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>是否开始审核？</b>',
      nzOnOk: async () => {
        const response = await this.api.Http({ name: 'activityCheck', data: this.check.data, attach: this.check.data['id'] + '' });
        if (response.success) {
          this.getDataList();
        }
      }
    });
  }

  // 审核 拒绝 通过
  public checkBehavior(type: any, item: any) {
    this.check.data['reason'] = '';
    this.check.data['id'] = item.id;
    this.check.data['check_status'] = type;
    this.check.show = true;
  }
  public async submitHand() {
    // 提交

    const res = await this.api.Http({ name: 'activityCheck', data: this.check.data, attach: this.check.data['id'] + '' });

    if (res.success) {
      this.getDataList();
      this.message.create('success', res.msg);
      this.check.show = false;
    }
  }

  public search() {
    this.page.index = 1;
    this.getDataList();
  }

  public resetSearch() {
    this.page.index = 1;
    this.checkTime = null;
    this.searchData = {
      check: '',
      prize: '',
      status: '',
      type: '',
      startTime: '',
      endTime: '',
      admin_name: '',
      obtain_type: ''
    };
    this.getDataList();
  }
  // 日期选择框
  public oncCheckChange(result: Date): void {
    this.searchData['startTime'] = this.toolService.formatTime(result[0], 'YYYY-MM-DD HH:MM:SS');
    this.searchData['endTime'] = this.toolService.formatTime(result[1], 'YYYY-MM-DD HH:MM:SS');
  }
  // 点击时间选项框
  public checkTimeHandle() {
    this.checkTime = [this.toolService.timeInit(), this.toolService.timeInit('???')];
    this.searchData['startTime'] = this.toolService.formatTime(this.checkTime[0], 'YYYY-MM-DD HH:MM:SS');
    this.searchData['endTime'] = this.toolService.formatTime(this.checkTime[1], 'YYYY-MM-DD HH:MM:SS');
  }
}
