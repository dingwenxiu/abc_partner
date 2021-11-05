import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { ApiService } from '../../../../api/api.service';
@Component({
  selector: 'app-channel-type',
  templateUrl: './channel-type.component.html',
  styleUrls: ['./channel-type.component.scss']
})
export class ChannelTypeComponent implements OnInit {
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
    data: {
      id: 0,
      // 支付方式种类名称
      type_name: '',
      // 支付方式种类标记
      type_sign: '',
      // 是否是银行 0 不是 1 是
      is_bank: 0,
      // 图标
      icon: ''
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

  // 获取数据列表
  public async getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
    };
    const res = await this.api.Http({name: 'paymentTypeList', data});
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
    this.edit.data = {
      id: 0,
      type_name: '',
      type_sign: '',
      is_bank: 0,
      icon: ''
    };
  }

  // 编辑
  public editHandler(item: any) {
    this.edit.type = 1;
    this.edit.data = this.api.filterData(this.edit.data, item);

    this.edit.show = true;
    this.edit.loading = false;
  }
  // 删除
  public deleteHandler(item: any) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: async () => {
        let data = {
          id: item.id
        }
        let response = await this.api.Http({name: 'paymentTypeDel', data})
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
      // 编辑
      url = 'paymentTypeEdit';
    } else {
      // 添加
      url = 'paymentTypeAdd';
    }
    this.edit.data.is_bank ? this.edit.data.is_bank = 1 : this.edit.data.is_bank = 0;
    const response = await this.api.Http({name: url, data, attach: data.id + ''});
    if (response.success) {
      this.message.create('success', response.msg);
      this.edit.show = false;
      this.getDataList();
    }
    this.edit.loading = false;
  }
  // 上传图片
  public upImages(e: any) {
    if (e.type === 'success') {
      this.edit.data.icon = e.fileList[0].response.data.path;
    }
  }
  // 删除图片
  public deleteImg() {
    this.edit.data.icon = null;
  }
}
