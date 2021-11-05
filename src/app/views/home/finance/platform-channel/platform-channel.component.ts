import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-platform-channel',
  templateUrl: './platform-channel.component.html',
  styleUrls: ['./platform-channel.component.scss']
})
export class PlatformChannelComponent implements OnInit {
  public tableList = [];
  public page = {
    index: 1,
    total: 0
  };

  // 编辑 添加
  public edit = {
    type: 0,
    show: false,
    loading: false,
    data: {}
  };
  // 关联规则
  public rule = [];

  public PlatformOptnios: any;
  public ChannelTypeOptions: any;
  constructor(
    public api: ApiService,
    public message: NzMessageService,
    public modalService: NzModalService
  ) { }

  async ngOnInit() {
    this.getDataList();
    const Platform = await this.api.Http({name: 'platformList'});
    const ChannelType = await this.api.Http({name: 'paymentTypeList'});
    this.PlatformOptnios = Platform.data.data;
    this.ChannelTypeOptions = ChannelType.data.data;
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
    const res = await this.api.Http({name: 'platformChannelList', data});
    if (res.success) {
      this.page.total = res.data.total;
      this.tableList  = res.data.data;
    }
  }

  // 添加
  public addHandler() {
    this.edit.type = 0;
    this.edit.show = true;
    this.edit.loading = false;
    this.edit.data = {};
  }

  // 编辑
  public editHandler(item: any) {
    this.edit.type = 1;
    for (const key in item) {
      if (typeof item[key] === 'number') {
        item[key] = item[key] + '';
      }
    }
    this.edit.data = Object.assign(this.edit.data, item);
    this.edit.show = true;
    this.edit.loading = false;
  }
  // 删除
  public deleteHandler(item: any) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: async () => {
        const data = {
          id: item.id
        };
        const response = await this.api.Http({name: 'platformChannelDel', data})
        if (response.success) {
          this.message.create('success', response.msg);
          this.getDataList();
        }
      }
    });
  }
  // 确认
  public async submitHandler() {
    const data = this.edit.data;

    this.edit.loading = true;

    let url = '';
    if (this.edit.type) {
      // 添加
      url = 'platformChannelEdit';
    } else {
      // 编辑
      url = 'platformChannelAdd';
    }
    data['status'] ? data['status'] = 1 : data['status'] = 0;
    const response = await this.api.Http({name: url, data})
    if (response.success) {
      this.message.create('success', response.msg);
      this.edit.show = false;
      this.getDataList();
    }
    this.edit.loading = false;
  }

  public async changeStatus(data: any) {
    const id = data.id;
    const response = await this.api.Http({name: 'platformChannelStatus', attach: id});
    if (response.success) {
      data.status = !data.status;
      this.message.create('success', response.msg);
    }
  }
}
