import { Component, OnInit, ɵConsole } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-withdraw-log-list',
  templateUrl: './withdraw-log-list.component.html',
  styleUrls: ['./withdraw-log-list.component.scss']
})
export class WithdrawLogListComponent implements OnInit {
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
    const res = await this.api.Http({name: 'withdrawLogList', data});
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

  public withdrawLogDetail(id) {
    this.api.Http({name: 'withdrawLogDetail', attach: id }).then((res: any) => {
      const {success, data} = res;
      if (success) {
        this.detailPop.show = true;
        this.detailPop.data = data;
      }
    });
  }
}
