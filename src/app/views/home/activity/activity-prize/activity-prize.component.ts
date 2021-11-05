import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';

import { NzMessageService, NzModalService } from 'ng-zorro-antd';
@Component({
  selector: 'app-activity-prize',
  templateUrl: './activity-prize.component.html',
  styleUrls: ['./activity-prize.component.scss']
})
export class ActivityPrizeComponent implements OnInit {
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
      // 名称
      name: '',
      // 所属的活动类型
      type: '',
      // 奖品的价格
      status: 0

    }
  }
  // 所属活动列表
  public activity_options = [];
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
    let res = await this.api.Http({name: 'activityPrizeList', data})
    if(res.success) {
      this.page.total = res.data.total;
      this.tableList  = res.data.data;
    }
  }

  // 添加
  public async addHandler () {
    this.edit.type = 0;
    this.edit.show = true;
    this.edit.loading = false;
    this.edit.data = {
      id: 0,
      type: '',
      name: null,
      status: 1,
    }
  }
  
  // 编辑
  public async editHandler (data: any) {
    this.edit.type = 1;
    this.edit.show = true;
    this.edit.loading = false;
    this.edit.data = this.api.filterData(this.edit.data, data);
  }
  // 删除
  public deleteHandler (item: any) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: async () => {
        let response = await this.api.Http({name: 'activityPrizeDel', attach: item['id'] + ''})
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
    
    this.edit.data.status ? this.edit.data.status = 1 : this.edit.data.status = 0;
    this.edit.loading = true;
    let response = await this.api.Http({name: 'activityPrizeAdd', data, attach: this.edit.data['id'] + '' });;
      if (response.success) {
        this.getDataList();
        this.message.create('success', response.msg);
        this.edit.show = false;
      }

      this.edit.loading = false;
  }

}
