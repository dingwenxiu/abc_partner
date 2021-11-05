import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';
import { NzModalService } from 'ng-zorro-antd';
@Component({
  selector: 'app-casino-platform-list',
  templateUrl: './casino-platform-list.component.html',
  styleUrls: ['./casino-platform-list.component.scss']
})

// 娱乐成平台列表
export class CasinoPlatformListComponent implements OnInit {
  public tableList = [];
  public timeCoulDown = false;
  public page = {
    index: 1,
    total: 0
  };

  public searchData = {
    page_index: this.page.index,
    page_size: 15,
  };

  // 详情
  public detail = {
    show: false,
  };

  constructor(
    public utils: ToolService,
    public api: ApiService,
    public router: Router,
    public modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getDataList();
  }

  // 获取数据列表
  public getDataList() {
    this.searchData.page_index = this.page.index;
    this.searchData.page_size = this.api.pageSize;
    this.api.Http({
      name: 'getPlatType',
      data: this.searchData
    }).then((res: any) => {
      if (res && res.success) {
        this.tableList = res.data.plat_form;
        this.page.total = res.data.total;
      }
    });
  }

  public pageChange() {
    this.getDataList();
  }

  // 返回
  public back() {
    this.getDataList();
  }

  // 详情
  public doDetail(item) {
    this.detail.show = true;
    // this.api.casinoPlatformDetail(item.id).then((res: any) => {
    //   if (res.success) {
    //     if (item && res.data) {

    //     } else {

    //     }
    //   }
    // }).catch(() => { })
  }

  public setShow(id) {
    this.api.Http({name: 'setHomePlat' , data: {plat_id: id}});
  }
  public async SynchronousData() {
    this.timeCoulDown = true;
    const response = await this.api.Http({name: 'seriesLists'});
    if(response.success) {
      let timeCat = 300;
      const timer = setInterval(() => {
        timeCat-- >= 0 ? '' : this.timeCoulDown = false;
      }, 1000);
      this.getDataList();
    }
  }

  // 上传图片
  public upImage(e: any) {
    if (e.type === 'success') {
      // this.edit.data.icon_path = e.fileList[0].response.data.path;
      this.getDataList();
    }
  }

  // 删除图片
  public delete(item, index) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确定要删除吗？</b>',
      nzOnOk: async () => {
        this.api.Http({name: 'deleteImage', data: {platforms: item.code}}).then((res) => {
          if (res.success) {
            const modal = this.modalService.success({
              nzTitle: '温馨提示',
              nzContent: res.msg
            });
            this.tableList[index].image = '';
          }
        });
      }
    });
  }
}
