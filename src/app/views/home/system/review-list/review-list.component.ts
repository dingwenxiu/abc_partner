import { Component, OnInit} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-system-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit {
  public tableList = [];
  public seriesId = 'ssc';
  public seriesList = {};
  public selectedValue: any;
  public searchData = {};
  public page = {
    index: 1,
    total: 0
  };
  public detailPop = {
    show: false,
    data: []
  };

  public processPop = {
    show: false,
    id: '',
    type: '',
    data: {
      fund_password: ''
    }
  };

  // 类型
  public frozenType = {
    0: '未冻结',
    1: '禁止登录',
    2: '禁止投注',
    3: '禁止提现',
    4: '禁止转账'
  };

  public frozenSelect = ['frozen', 'frozenAll'];

  public userId = '';
  public userName = '';
  public editClear = null;

  public testWitch = false;
  public reviewType = '';

  public typeDetail = {
    system_transfer_add: {
      name: '玩家理赔',
      detail: ['', '普通理赔', '分红理赔', '充值理赔', '红包理赔', '活动礼金']
    },
    system_transfer_reduce: {
      name: '玩家扣减',
      detail: ['', '系统扣减', '充值错误扣减', '礼金错误扣减', '奖金错误扣减', '提现扣减']
    },
    fund_password: {
      name: '资金密码',
      detail: []
    },
    login_password: {
      name: '登录密码',
      detail: []
    },
    frozen: {
      name: '玩家解冻',
      detail: ['未冻结', '禁止登录', '禁止投注', '禁止提现', '禁止转账', '禁止资金']
    },
    frozenAll: {
      name: '玩家解冻(包含下级)',
      detail: ['未冻结', '禁止登录', '禁止投注', '禁止提现', '禁止转账', '禁止资金']
    }
  };

  constructor(
    public utils: ToolService,
    public api: ApiService,
    public router: Router,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getDataList();
    const user = this.utils.storage.get('user');
    this.userId = user.data.user_id;
    this.userName = user.data.username;
  }

  public selectTab(seriesId) {
    this.seriesId = seriesId;
    this.getDataList();
  }

  public getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
      ...this.searchData
    };

    this.api.Http({name: 'reviewList', data}).then((res: any) => {
      if (res && res.success) {
        // res.data.data[0].handle_admin_one = 'klc_supertwo';
        // res.data.data[1].handle_admin_two = 'klc_supertwo';
        this.tableList = res.data.data;
        this.seriesList = res.data.seriesList;
        this.page.total = res.data.total;
      }
    });
  }

  public search() {
    this.getDataList();
  }

  public resetSearch() {
    this.searchData = {};
    this.reviewType = '';
    this.getDataList();
  }

  public pageChange() {
    this.getDataList();
  }

  public detailShow(data: any) {
    this.detailPop.show = true;
    this.detailPop.data = data;
  }

  public doPageChange() {
    this.getDataList();
  }
  public process() {
    if (this.processPop.type === 'no' && !(this.processPop.data['review_fail_reason'] || this.processPop.data['process_desc'])) {
      const modal = this.modalService.success({
        nzTitle: '温馨提示',
        nzContent: '原因不能为空'
      });
      return;
    }
    this.api.Http({
      name: 'reviewProcess',
      data: {...this.processPop.data},
      attach: this.processPop.id
    }).then((res: any) => {
      if (res.success) {
        this.getDataList();
        this.processPop.show = false;
      }
    });
  }

  public processEnter(id: any, type: any) {
    this.processPop.show = true;
    this.processPop.id = id;
    this.processPop.type = type;
    this.processPop.data = {
      fund_password: ''
    }
    if (type === 'no') {
      this.processPop.data['mode'] = 'fail';
    }

    this.processPop.data.fund_password = null;
  }

  public detail(id) {
    this.api.Http({name: 'reviewDetail', attach: id}).then((res: any) => {
      this.detailPop.show = true;
      const {data} = res;
      this.detailPop.data = data;
    });
  }

  public typeChange($event) {
    this.searchData = {};
    this.searchData['type'] = $event;
  }
}
