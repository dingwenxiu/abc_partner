import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalService, UploadFile } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';
import { UEditorComponent } from 'ngx-ueditor';

@Component({
  selector: 'app-system-help-menu-list',
  templateUrl: './help-menu-list.component.html',
  styleUrls: ['./help-menu-list.component.scss']
})
export class HelpMenuListComponent implements OnInit {
  @ViewChild('full', {static: false})
  full: UEditorComponent;
  public tableList = [];
  public searchData = {};
  public page = {
    index: 1,
    total: 0
  };

  public contentPop = {
    show: false,
    data: ''
  };

  public addPop = {
    show: false,
    type: '',
    data: {
      title: '',
      content: '',
      pid: null
    }
  };
  public helpFileList = [];
  public menuOptions = [];

  constructor(
    public utils: ToolService,
    public api: ApiService,
    public router: Router,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getDataList();
    this.getMenuOptions();
  }
  public getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
    };
    Object.assign(data, this.searchData);
    this.api.Http({name: 'helpMenuList', data}).then((res: any) => {
      if (res && res.success) {
        const arrData = res.data.data;
        const tableData = [];
        for (const key in arrData) {
          if (key) {
            for (const value of arrData[key]) {
              if (typeof value === 'object') {
                tableData.push(value);
              }
            }
          }
        }
        this.tableList = tableData;
        this.page.total = res.data.total;
      }
    });
  }

  public getMenuOptions() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
    };
    Object.assign(data, this.searchData);
    this.api.Http({name: 'helpMenu', data}).then((res: any) => {
      if (res && res.success) {
        this.menuOptions = res.data;
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
      type: 'add',
      data: {
        title: '',
        content: '',
        pid: null
      }
    };
  }

  public submit() {
    const $this = this;
    return {
      add() {
        $this.api.Http({name: 'addHelpContent', data: {...$this.addPop.data}, attach: $this.addPop.data.pid}).then((res: any) => {
          $this.addPop.show = false;
          $this.getDataList();
        });
      },
      edit() {
        $this.api.Http({name: 'editHelp', data: {...$this.addPop.data}, attach: $this.addPop.data.pid}).then((res: any) => {
          $this.addPop.show = false;
          $this.getDataList();
        });
      }
    };
  }

  public edit(item) {
    this.addPop.data = this.utils.ChangeDataValStr(item);
    const fileList = [
      {
        uid: item.id,
        name: 'helpImg.png',
        status: 'done',
        url: item.help_image
      }
    ];
    this.helpFileList = item.help_image ? fileList : [];
    this.addPop.show = true;
    this.addPop.type = 'edit';
  }
  public sub() {
    const {type} = this.addPop;
    if (type === 'add') {
      this.submit().add();
    } else if (type === 'edit') {
      this.submit().edit();
    }
  }

  public delete(id: any) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: async () => {
        this.api.Http({name: 'contentDel', attach: id + ''}).then((res: any) => {
          if(res.success) {
            this.getDataList();
          }
        });
      }
    });
  }

 public removeLogo = (file: UploadFile) => {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: async () => {
        const {status, url, uid} = file;
        if (status === 'removed') {
          this.api.Http({name: 'helpImgDel', data: {id: uid + ''}}).then((res: any) => {
            const {success} = res;
            if (success) {
              this.modalService.success({
                nzTitle: '提示',
                nzContent: `删除成功`
              });
            }
          });
        }
      }
    });
  }

  public _ready(e: any) { }
  public _destroy() { }
  public _change(e: any) { }

  public lockTd($event) {
    const notNode = ['A', 'TD'];
    const {target} = $event;
    if (!notNode.includes(target.nodeName) && target.id !== 'operating') {
      this.contentPop = {
        show: true,
        data: $event.target.innerHTML
      };
    }
  }
}
