import { Component, OnInit, ViewChild } from '@angular/core';
import { UEditorComponent } from 'ngx-ueditor';
import { NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-system-help-menu',
  templateUrl: './help-menu.component.html',
  styleUrls: ['./help-menu.component.scss']
})
export class HelpMenuComponent implements OnInit {
  @ViewChild('full', {static: false})
  full: UEditorComponent;
  public tableList = [];
  public searchData = {};
  public page = {
    index: 1,
    total: 0
  };

  public addPop = {
    show: false,
    data: {
      name: '',
      content: ''
    }
  };

  constructor(
    public utils: ToolService,
    public api: ApiService,
    public router: Router,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getDataList();
  }

  public getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
    };
    Object.assign(data, this.searchData);
    this.api.Http({name: 'helpMenu', data}).then((res: any) => {
      if (res && res.success) {
        this.tableList = res.data;
        this.page.total = res.data.total;
      }
    });
  }

  public doPageChange() {
    this.getDataList();
  }

  public search() {
    this.page.index = 1;
    this.getDataList();
  }

  public resetSearch() {
    this.searchData = {};
    this.getDataList();
  }

  public add() {
    this.addPop = {
      show: true,
      data: {
        name: '',
        content: '',
      }
    };
  }

  public addSub() {
    this.api.Http({name: 'helpMenuAdd', data: {...this.addPop.data}}).then((res: any) => {
      this.addPop.show = false;
      this.getDataList();
    });
  }

  public delete(id) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: async () => {
        this.api.Http({name: 'helpMenuDel', attach: id + ''}).then((res: any) => {
          if(res.success) {
            this.getDataList();
          }
        });
      }
    });
  }

  public _ready(e: any) { }
  public _destroy() { }
  public _change(e: any) { }
}
