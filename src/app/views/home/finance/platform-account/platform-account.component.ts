import { Component, OnInit, ɵConsole } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-platform-account',
  templateUrl: './platform-account.component.html',
  styleUrls: ['./platform-account.component.scss']
})
export class PlatformAccountComponent implements OnInit {
  public tableList = [];
  public PlatformOptnios: any;
  public PlatformChannelOptions: any;
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
    }
  };
  // 关联规则
  public rule = [];
  public formChannelIndex = null;
  constructor(
    public api: ApiService,
    public message: NzMessageService,
    public modalService: NzModalService
  ) { }

  async ngOnInit() {
    this.getDataList();
    this.getOptions();
  }

  public async getOptions($event = 'panda') {
    const optnios = await this.api.Http({name: 'listChild', attach: 'platformList'});
    const {success, data} = optnios;
    if (success) {
      this.PlatformOptnios = data;
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
    const res = await this.api.Http({name: 'platformAccountList', data});
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
    };
  }

  // 编辑
  public async editHandler(item: any) {
    this.edit.type = item.id;
    const option = {
      platform_sign: item.platform_sign,
      platform_domain_url: '',
      merchant_code: '',
      merchant_secret: '',
      public_key: '',
      private_key: '',
      app_id: '',
      status: 0
    }
    this.edit.data = this.api.filterData(option, item);
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
        const response = await this.api.Http({name: 'platformAccountDel', attach: data.id + ''});
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
    data['status'] ? data['status'] = 1 : data['status'] = 0;
    const response = await this.api.Http({name: 'platformAccountAdd', data, attach: this.edit.type + ''});
    if (response.success) {
      this.message.create('success', response.msg);
      this.edit.show = false;
      this.getDataList();
    }
    this.edit.loading = false;
  }

  public async changeStatus(data: any) {
    const id = data.id;
    const response = await this.api.Http({name: 'platformAccountStatus', attach: id});
    if (response.success) {
      data.status = !data.status;
      this.message.create('success', response.msg);
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
  // 获取支付渠道
  public updateForeignChannel(data) {
    this.api.Http({name: 'updateForeignChannel', attach: data.id}).then((res: any) => {
      const {success, msg} = res;
      if (success) {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: msg
        });
      }
    });
  }

  // 更新代付渠道
  public updatePaymentChannel(data) {
    this.api.Http({name: 'updatePaymentChannel', attach: `/${data.id}`}).then((res: any) => {
      const {success, msg} = res;
      if (success) {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: msg
        });
      }
    });
  }

  // 更新充值渠道
  public updateRechargeChannel(data) {
    this.api.Http({name: 'updateRechargeChannel', attach: `/${data.id}`}).then((res: any) => {
      const {success, msg} = res;
      if (success) {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: msg
        });
      }
    });
  }
}
