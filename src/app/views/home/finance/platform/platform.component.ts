import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { ApiService } from '../../../../api/api.service';
@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent implements OnInit {
  public tableList = [];
  public page = {
    index: 1,
    total: 0
  };

  public contentPop = {
    show: false,
    data: ''
  };

  // 编辑 添加
  public edit = {
    type: 0,
    show: false,
    loading: false,
    data: {
      id: 0,
      // 厂商名称
      platform_name: '',
      // 厂商标记
      platform_sign: '',
      // ip
      whitelist_ips: 0
    }
  }
  // 关联规则
  public rule = [];
  constructor(
    public api: ApiService,
    public message: NzMessageService,
    public modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getDataList();
  }

  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  public lockTd($event) {
    const notNode = ['P', 'SECTION'];
    const { target } = $event;
    if (notNode.includes(target.nodeName) && target.id !== 'operating') {
      this.contentPop = {
        show: true,
        data: $event.target.innerText
      };
    }
  }

  // 获取数据列表
  public async getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
    };
    let res = await this.api.Http({name: 'platformList', data});
    if (res.success) {
      this.page.total = res.data.total;
      this.tableList  = res.data.data;
    }
  }

  // 添加
  public addHandler () {
    this.edit.type = 0;
    this.edit.show = true;
    this.edit.loading = false;
    this.edit.data = {
      id: 0,
      platform_name: '',
      platform_sign: '',
      whitelist_ips: 0
    };
  }

  // 编辑
  public editHandler (item: any) {
    this.edit.type = 1;
    this.edit.data = this.api.filterData(this.edit.data, item);

    this.edit.show = true;
    this.edit.loading = false;
  }
  // 删除
  public deleteHandler (item: any) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: async () => {
        let data = {
          id: item.id
        }
        let response = await this.api.Http({name: 'platformDel', data})
        if (response.success) {
          this.message.create('success', response.msg);
          this.getDataList();
        }
      }
    });
  }
  // 确认 
  public async submitHandler () {
    let data = this.edit.data;

    this.edit.loading = true;

    let url = '';
    if (this.edit.type) {
      // 编辑
      url = 'platformEdit';
    } else {
      // 添加
      url = 'platformAdd';
    }
    let response = await this.api.Http({name: url, data})
    if (response.success) {
      this.message.create('success', response.msg);
      this.edit.show = false;
      this.getDataList();
    }
    this.edit.loading = false;
  }
}
