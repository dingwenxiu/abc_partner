import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { NzModalService } from 'ng-zorro-antd';
// 待定
@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss']
})

export class ConfigureComponent implements OnInit {
  public tableList = [];
  public mapOfExpandData: { [key: string]: boolean } = {};

  public parentOption = [];

  public page = {
    index: 1,
    total: 0
  };

  public parent = {
    id: 0,
    pid: 0,
    name: '',
  };

  public edit   = {
    show: false,
    province_options: {},
    platform_options: {},
    bank_options: {},
    buttonLoading: false,
    data: {}
  };

  public childTableList: any;
  public childPop = false;

  constructor( public api: ApiService, private modalService: NzModalService ) {

  }

  // 初始化
  ngOnInit() {
    this.getDataList();
  }

  // 回退
  public back() {
    this.edit.show = false;
    this.edit.buttonLoading = false;
    this.getDataList();
  }

  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  // 初始化配置数据
  public initConfig() {
    this.edit.data = {};
  }

  // 添加 / 编辑 配置
  public addConfigure(item) {
    if (item) {
      this.edit.data = {
        id: item.id,
        sign: item.sign,
        value: item.value,
        pid: item.pid + '',
        description: item.description,
        name: item.name,
        status: item.status
      };
    } else {
      this.initConfig();
    }
    this.edit.show = true;
  }

  // 提交编辑
  public submitEdit() {
    this.edit.buttonLoading = true;
    const data = {...this.edit.data};
    this.api.Http({
      name: 'configureAdd',
      data,
      attach: data['id'] ? data['id'] + '' : '0'
    }).then((res: any) => {
      if (res.success) {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '恭喜您, 添加成功 !'
        });
        this.back();
      }
      this.edit.buttonLoading = false;
    }).catch(() => {this.edit.buttonLoading = false; })
  }

  // 状态
  public doStatus(id: any) {
    this.api.Http({
      name: 'configureStatus',
      attach: id
    }).then((res: any) => {
      if (res.success) {
        this.getDataList();
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '恭喜, 修改成功 !'
        });
      }
    });
  }

  // 获取数据列表
  public getDataList() {
    this.api.Http({name: 'configureList'}).then((res: any) => {
      if (res.success) {
        this.tableList      = res.data.data;
        const arr = [];
        const parent_option = res.data.parent_option;
        // tslint:disable-next-line: forin
        for (const key in parent_option) {
          arr.push({key, value: parent_option[key]});
        }
        this.parentOption = arr;
      }
    });
  }

  // 查看子级
  public lookChild(data) {
    this.childPop = true;
    this.childTableList = data.child;
  }

  public doFlush() {
    this.api.Http({name: 'configureFlush'}).then((res: any) => {
      if (res.success) {
        this.getDataList();
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '恭喜, 刷新所有缓存成功 !'
        });
      } else {
        const modal = this.modalService.error({
          nzTitle: '温馨提示',
          nzContent: '恭喜, 刷新所有缓存失败 !'
        });
      }
    });
  }

}
