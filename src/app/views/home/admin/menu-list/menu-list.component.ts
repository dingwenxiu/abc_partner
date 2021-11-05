import { Component, OnInit, Input} from '@angular/core';
import {ApiService} from '../../../../api/api.service';
import {NzModalService} from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-domain-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})

export class MenuListComponent implements OnInit {
  public tableList = [];
  public tplModalButtonLoading = false;
  public childsList = [];
  public clickIndex = -1;
  public isEdit = [];
  public menuType = {};
  public menuIndexObj = {0: 0, 1: 0};
  public page = {
    index: 1,
    total: 0
  };

  constructor(
    public api: ApiService,
    private modalService: NzModalService,
    private message: NzMessageService
  ) {

  }

  // 初始化
  ngOnInit() {
    this.getDataList();
  }

  public getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
    };

    this.api.Http({name: 'menuList', data}).then((res: any) => {
      if (res.success) {
        const dataList = res.data.data;
        this.tableList = dataList;
        this.menuType = res.data.menu_type_options;
        this.childsList[0] = dataList;
        for (let i = 0; i < 3; i++ ) {
          const sub = this.childsList[i][this.menuIndexObj[i]];
          if ( sub && sub.hasOwnProperty('childs')) {
            this.childsList[i + 1] = sub.childs;
          } else {
            this.childsList.splice(i + 1 , 1);
            break;
          }
        }
      }
    });
  }
  public openChilds(item, index1 = -1, id , index2 = -1) {
    this.menuIndexObj[index1] = index2;
    this.childsList[index1 + 1] = item.childs;
    this.childsList.splice(index1 + 2 , 1);
    this.isEdit[index1] = id;
  }

  public changeMenuStatus(id, index1 = -1, index2 = -1) {
    this.menuIndexObj[index1] = index2;
    this.api.Http({name: 'menuStatus', attach: id + ''}).then((res: any) => {
      const {success, msg} = res;
      if (success) {
        this.getDataList();
      }
      this.message.success(msg);
    });
  }
}
