import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ApiService } from '../../../../api/api.service';
import { ToolService } from '../../../../tool/tool.service';
import { UEditorComponent } from 'ngx-ueditor';
import { async } from '@angular/core/testing';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-merchants-config',
  templateUrl: './merchants-config.component.html',
  styleUrls: ['./merchants-config.component.scss']
})

export class MerchantsConfigComponent implements OnInit {
  @ViewChild('full', {static: false})
  full: UEditorComponent;

  public contentPop = {
    show: false,
    data: ''
  };

  public tableList = [];
  public page = {
    index: 1,
    total: 0
  };

  public editPop = {
    show: false,
    data: {}
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
      page_size: 10,
    };
    this.api.Http({
      name: 'getTemplate',
      data
    }).then( (res: any) => {
      if (res.success) {
        this.tableList  = res.data;
      }
    });
  }

  public set(item) {
    this.api.Http({
      name: 'setTemplate',
      data: {
        template_sign: item.sign
      }
    }).then( (res: any) => {
      if (res.success) {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '恭喜您, 操作成功 !'
        });
        this.getDataList();
      }
    });
  }


  // 回退
  public back() {
    this.getDataList();
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
