import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ApiService } from '../../../../api/api.service';
import { ToolService } from '../../../../tool/tool.service';
import { UEditorComponent } from 'ngx-ueditor';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.scss']
})

export class NoticeListComponent implements OnInit {
  @ViewChild('full', {static: false})
  full: UEditorComponent;
  // 公告弹窗
  public addNoticePop = {
    pop: false,
    type: ''
  };

  public contentPop = {
    show: false,
    data: ''
  };

  public tableList = [];
  public page = {
    index: 1,
    total: 0
  };

  public typeOption = [];
  public deviceTypeOption;

  public addData = {
    show: false,
    buttonLoading: false,
    data: {
      id: 0,
      type: null,
      device_type: null,
      title: '',
      content: '',
      start_time: null,
      end_time: null,
      type_desc: ''
    }
  };

  constructor(
    public api: ApiService,
    public utils: ToolService,
    public router: Router,
    public message: NzMessageService,
    public modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getDataList();
  }

  // 公告列表
  public getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
    };

    this.api.Http({
      name: 'noticeList',
      data
    }).then( (res: any) => {
      if (res.success) {
        this.page.total = res.total;
        this.tableList  = res.data.data;
        const arr = [];
        // tslint:disable-next-line: forin
        for (const key in res.data.type_option) {
          arr.push({key, value: res.data.type_option[key]});
        }
        this.typeOption         = arr;
        this.deviceTypeOption   = res.data.device_type_option;
      }
    });
  }

  public async deleteNotice (item: any) {

    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: async () => {
        let res = await this.api.Http({name: 'noticeDel', data: { id: item.id}})
        if (res.success) {
          this.getDataList();
          this.message.create('success', res.msg);
        }
      }
    });
  }
  // 状态
  public doStatus(id: any) {
    this.api.Http({
      name: 'noticeStatus',
      attach: id
    }).then((res: any) => {
      if (res.success) {
        this.getDataList();
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '恭喜, 修改成功 !'
        });
      } else {
        const modal = this.modalService.error({
          nzTitle: '温馨提示',
          nzContent: '恭喜, 修改失败 !'
        });
      }
    });
  }

  // 置顶
  public doTop(id: any) {
    this.api.Http({
      name: 'noticeTop',
      attach: id
    }).then((res: any) => {
      if (res.success) {
        this.getDataList();
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '恭喜, 置顶成功 !'
        });
      } else {
        const modal = this.modalService.error({
          nzTitle: '温馨提示',
          nzContent: '恭喜, 置顶失败 !'
        });
      }
    });
  }

  // 刷新缓存
  public doFlush() {
    this.api.Http({name: 'noticeFlush'}).then((res: any) => {
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

  // 添加 编辑公告
  public addNotice(item, data) {
    this.addNoticePop['pop'] = true;
    this.addNoticePop['type'] = item;
    if (data) {
      this.addData.data = this.utils.ChangeDataValStr(this.api.filterData(this.addData.data, data));
    } else {
      this.addData.data = {
        id: 0,
        type: '1',
        device_type: '1',
        title: '',
        content: '',
        start_time: null,
        end_time: null,
        type_desc: ''
      };
    }
  }

  // 提交公告
  public submitNotice() {
    const data = this.addData.data;
    if (new Date(data.start_time).getTime() > new Date(data.end_time).getTime()) {
      const modal = this.modalService.error({
        nzTitle: '错误',
        nzContent: '开始时间不能大于结束时间 !'
      });
      return;
    }
    this.addData.buttonLoading = true;
    this.api.Http({
      name: 'noticeAdd',
      data,
      attach: this.addNoticePop['type']
    }).then((res: any) => {
      if (res.success) {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: res.msg
        });
        this.addData.buttonLoading = false;
        this.back();
      }

      this.addData.buttonLoading = false;
    }).catch(() => {this.addData.buttonLoading = false; });
  }

  // 回退
  public back() {
    this.getDataList();
    this.addNoticePop.pop = false;
  }

  // 翻页
  public pageChange() {
    this.getDataList();
  }

  public _ready(e: any) { }
  public _destroy() { }
  public _change(e: any) { }

  public lockTd($event) {
    const notNode = ['P', 'SECTION'];
    const {target} = $event;
    if (notNode.includes(target.nodeName) && target.id !== 'operating' || target.id === 'text-content') {
      this.contentPop = {
        show: true,
        data: $event.target.innerHTML
      };
    }
  }
}
