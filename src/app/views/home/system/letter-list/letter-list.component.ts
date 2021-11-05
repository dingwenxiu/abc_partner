import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ApiService } from '../../../../api/api.service';
import { ToolService } from '../../../../tool/tool.service';
import { UEditorComponent } from 'ngx-ueditor';
import { async } from '@angular/core/testing';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-letter-list',
  templateUrl: './letter-list.component.html',
  styleUrls: ['./letter-list.component.scss']
})

export class LetterListComponent implements OnInit {
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
      user_type: '4',
      title: '',
      content: ''
    }
  };

  public checkedAll = false;
  public checked = [];
  public indeterminate: boolean;
  public DelIdList = [];

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
      page_size: 10,
    };
    this.api.Http({
      name: 'MessageList',
      data
    }).then( (res: any) => {
      if (res.success) {
        this.page.total = res.data.total;
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

  public async DelAll() {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: async () => {
        const res = await this.api.Http({name: 'MessageDel', data: { id: this.DelIdList}});
        if (res.success) {
          this.getDataList();
          this.message.create('success', res.msg);
          this.indeterminate = false;
          this.checked = [];
        }
      }
    });
  }

  public DelCheckedAll($event) {
    if ($event) {
      this.tableList.forEach((value, index) => {
        this.checked[index] = true;
        this.DelIdList.push(value.id);
      });
    } else {
      this.checked = [];
      this.DelIdList = [];
    }
    this.indeterminate = false;
  }

  public DelChecked($event, id) {
    if ($event) {
      this.DelIdList.push(id);
      this.indeterminate = true;
    } else {
      const index = this.DelIdList.indexOf(id);
      if (index !== -1) { this.DelIdList.splice(index, 1); }
    }
  }

  // 添加 编辑公告
  public addNotice(item, data) {
    this.addNoticePop.pop = true;
    this.addNoticePop.type = item;
    if (data) {
      this.addData.data = this.utils.ChangeDataValStr(this.api.filterData(this.addData.data, data));
    } else {
      this.addData.data = {
        user_type: null,
        title: '',
        content: ''
      };
    }
  }

  // 提交公告
  public submitNotice() {
    const data = {...this.addData.data};
    if (data.title.length > 12) {
      const modal = this.modalService.error({
        nzTitle: '温馨提示',
        nzContent: '标题必须少于12个字符'
      });
      return;
    }
    if (/[^A-Za-z0-9,]/.test(data['user_config'])) {
      const modal = this.modalService.error({
        nzTitle: '温馨提示',
        nzContent: '用户名包含非法字符'
      });
      return;
    }
    if (this.addData.data['user_config']) {
      const set = new Set(data['user_config'].split(','));
      data['user_config'] = Array.from(set).filter( value => value);
    }
    this.addData.buttonLoading = true;
    this.api.Http({
      name: 'MessageAdd',
      data
    }).then((res: any) => {
      if (res.success) {
        this.message.success(res.msg);
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

  public userTypeChange($event) {
    delete this.addData.data['username'];
  }

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
