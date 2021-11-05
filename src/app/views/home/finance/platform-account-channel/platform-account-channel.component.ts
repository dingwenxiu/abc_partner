import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { ApiService } from '../../../../api/api.service';
import { ToolService } from '../../../../tool/tool.service';
@Component({
  selector: 'app-platform-account-channel',
  templateUrl: './platform-account-channel.component.html',
  styleUrls: ['./platform-account-channel.component.scss']
})
export class PlatformAccountChannelComponent implements OnInit {
public tableList = [];
  public page = {
    index: 1,
    total: 0
  };

  public searchData = {};

  // 编辑 添加
  public edit = {
    type: 0,
    show: false,
    loading: false,
    data: {
      platform_sign: '',
      type_sign: '',
      front_name: '',
      front_remark: '',
      back_name: '',
      back_remark: '',
      fee_type: '',
      fee_from: '',
      fee_amount: '',
      fee_return: '',
      max: '',
      min: '',
      device: '',
      sort: '',
      status: '',
      level: '',
      platform_channel_id: ''
    }
  };
  // 关联规则
  public rule = [];

  // 用户等级
  public levels = [
    {label: '1', value: '1', checked: false},
    {label: '2', value: '2', checked: false},
    {label: '3', value: '3', checked: false},
    {label: '4', value: '4', checked: false},
    {label: '5', value: '5', checked: false},
    {label: '6', value: '6', checked: false},
    {label: '7', value: '7', checked: false},
    {label: '8', value: '8', checked: false},
    {label: '9', value: '9', checked: false}
  ];

  public PlatformOptnios: any;
  public ChannelTypeOptions: any;
  public FormAccountOptions: any;
  public FormChannel: any;
  public platformOption = [];
  public accountOption = [];
  constructor(
    public api: ApiService,
    public message: NzMessageService,
    public modalService: NzModalService,
    private utils: ToolService
  ) { }

  async ngOnInit() {
    this.getDataList();
    this.getOptions();
    this.getPlatform();
    this.getAccount();
  }

  public getPlatform() {
    this.api.Http({name: 'platformList'}).then((res) => {
      this.platformOption = res.data.data;
    });
  }

  public getAccount() {
    this.api.Http({name: 'platformAccountList'}).then((res) => {
      this.accountOption = res.data.data;
    });
  }

  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  public async getOptions($event = 'panda') {
    const optnios = await this.api.Http({name: 'listChild', attach: $event});
    const {success, data} = optnios;
    if (success) {
      this.PlatformOptnios = data['platform'];
      this.ChannelTypeOptions = data['type'];
      this.FormAccountOptions = data['account_id'];
      this.FormChannel = data['channel'];
    }
  }

  // 获取数据列表
  public async getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
      ...this.searchData
    };
    const res = await this.api.Http({name: 'platformAccountChannelList', data});
    if (res.success) {
      this.page.total = res.data.total;
      this.tableList  = res.data.data;
    }
  }

  public serach() {
    this.getDataList();
  }

  public resetSearch() {
    this.searchData = {};
    this.getDataList();
  }

  // 添加
  public addHandler() {
    this.edit.type = 0;
    this.edit.show = true;
    this.edit.loading = false;
    for(let k of this.levels) {
      k.checked = false;
    }
    this.edit.data = {
      platform_sign: '',
      type_sign: '',
      front_name: '',
      front_remark: '',
      back_name: '',
      back_remark: '',
      fee_type: '',
      fee_from: '',
      fee_amount: '',
      fee_return: '',
      max: '',
      min: '',
      device: '',
      sort: '',
      status: '',
      level: '',
      platform_channel_id: ''
    };
  }
  // 编辑
  public editHandler(item: any) {
    const arr = item.level.split(',');
    this.edit.type = 1;
    for (const k of this.levels) {
      k.checked = false;
    }
    for (const k of this.levels) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < arr.length; i++) {
        if (+arr[i] === +k.value) {
          k.checked = true;
        }
      }
    }

    this.edit.data = this.api.filterData(this.edit.data, this.utils.ChangeDataValStr(item));
    this.edit.show = true;
    this.edit.loading = false;
  }
  // 确认
  public async submitHandler() {
    const data = this.edit.data;

    this.edit.loading = true;

    let arr = [];
    for(let k of this.levels) {
      if (k.checked) {
        arr.push(k.value)
      }
    }
    this.edit.data['level'] = arr.join(',');

    data['status'] ? data['status'] = '1' : data['status'] = '0';
    const response = await this.api.Http({name: 'platformAccountChannelAdd', data, attach: this.edit.type ? data['id'] + '' : '0' });
    if (response.success) {
      this.message.create('success', response.msg);
      this.edit.show = false;
      this.getDataList();
    }
    this.edit.loading = false;
  }

  public changeStatus(id) {
    this.api.Http({name: 'platformAccountChannelStatus', attach: `/${id}`}).then(res => {
      const {success, msg} = res;
      const modal = this.modalService.success({
        nzTitle: '温馨提示',
        nzContent: msg
      });
      this.getDataList();
    });
  }
}
