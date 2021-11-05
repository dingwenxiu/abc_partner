import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-player-vip-config',
  templateUrl: './player-vip-config.component.html',
  styleUrls: ['./player-vip-config.component.scss']
})

export class PlayerVipConfigComponent implements OnInit {
  public tableList    = [];

  public page = {
    index: 1,
    total: 0
  };

  public detailPop = {
    show: false,
    data: {},
  };

  public addPop = {
    show: false,
    type: 0,
    data: {}
  };

  constructor(
    public utils: ToolService,
    public api: ApiService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getDataList();
  }

  // 获取数据列表
  public getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize
    };
    this.api.Http({
      name: 'playerVipConfig',
      data
    }).then((res: any) => {
      if (res.success) {
        this.page.total = res.data.total;
        this.tableList  = res.data.data;
      }
    });
  }

  // 翻页
  public pageChange() {
    this.getDataList();
  }

  // 修改状态
  public changeStatus(item: any, index: any) {
    this.api.Http({
      name: 'adminUserStatus',
      attach: item.id
    }).then((res: any) => {
      const {success, msg} = res;
      const modal = this.modalService.success({
        nzTitle: '温馨提示',
        nzContent: msg
      });
      if (success) { this.tableList[index]['status'] = !item.status; }
    });
  }

  public toDetail(item) {
    this.api.Http({name: 'playerVipConfigDetail', attach: item.id}).then((res: any) => {
      const {success, data} = res;
      if (success) {
        this.detailPop = {
          show: true,
          data: {...data}
        };
      }
    });
  }

  public toEdit(item) {
    this.addPop = {
      show: true,
      type: item.id,
      data: {...item}
    };
  }

  public addVip() {
    this.addPop = {
      show: true,
      type: 0,
      data: {}
    };
  }

  public subConfig() {
    const option = {
      vip_level: '',
      name: '',
      show_name: '',
      recharge_total: '',
      icon: '',
    };
    for (const key in option) {
      if (key) {
        option[key] = this.addPop.data[key];
      }
    }
    this.api.Http({
      name: 'addPlayerVipConfig',
      data: {...option},
      attach: `/${this.addPop.type}`
    }).then((res: any) => {
      const {success, data} = res;
      if (success) {
        this.getDataList();
        this.addPop.show = false;
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '操作成功!'
        });
      }
    });
  }

  // 上传图片
  public upImages(e: any) {
    if (e.type === 'success') {
      this.addPop.data['icon'] = e.fileList[0].response.data.path;
    }
  }
  // 删除图片
  public deleteImg(type: any) {
    this.addPop.data['icon'] = null;
  }
}
