import { Component, OnInit, ɵConsole } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-recharge-log-list',
  templateUrl: './recharge-log-list.component.html',
  styleUrls: ['./recharge-log-list.component.scss']
})
export class RechargeLogListComponent implements OnInit {
  public tableList = [];
  public page = {
    index: 1,
    total: 0
  };

  public contentPop = {
    show: false,
    data: ''
  };

  public detailPop = {
    show: false,
    data: {}
  };


  constructor(
    public api: ApiService,
    public message: NzMessageService,
    public modalService: NzModalService
  ) { }

  async ngOnInit() {
    this.getDataList();
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
    const res = await this.api.Http({name: 'rechargeLogList', data});
    if (res.success) {
      this.page.total = res.data.total;
      this.tableList  = res.data.data;
    }
  }

  public lockTd($event) {
    const notNode = ['SPAN', 'P'];
    const {target} = $event;
    if (notNode.includes(target.nodeName) && target.id !== 'operating') {
      this.contentPop = {
        show: true,
        data: $event.target.innerText
      };
    }
  }

  public rechargeLogDetail(id) {
    this.api.Http({name: 'rechargeLogDetail', attach: id }).then((res: any) => {
      const {success, data} = res;
      if (success) {
        this.detailPop.show = true;
        this.detailPop.data = data;
      }
    });
  }
}
