import { Component, OnInit } from '@angular/core';
import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-check-user-list',
  templateUrl: './check-user-list.component.html',
  styleUrls: ['./check-user-list.component.scss']
})
export class CheckUserListComponent implements OnInit {
  public tableList = [];


  public page = {
    index: 1,
    total: 0
  };

  // 添加 编辑
  public edit = {
    userType: ['', '', ''],
    show: false,
    type: 0,
    data: {
      id: 0,
      type: '',
      type_detail: null,
      users: null
    }
  };

  // 添加编辑的数据
  public typeList = [];
  public detailList = [];
  public adminListAll = [[], [], []];
  public adminList = [[], [], []];
  public groupList = [[], [], []];

  public checkedAll = [];
  public indeterminate = [];

  constructor(
    public utils: ToolService,
    public api: ApiService,
    public message: NzMessageService,
    public modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getDataList();
    this.getCheckType();
    this.adminUserList();
    this.adminGroupList();
  }

  public updateChecked(type) {
    const list = this.adminList[type];
    if (list.every(item => item.checked === true)) {
      this.checkedAll[type] = true;
    } else if (list.some(item => item.checked === false)) {
      this.checkedAll[type] = false;
    }
  }

  public updateAllChecked($event, type) {
    let list = [...this.adminList[type]];
    list = list.map(item => {
      return {
        ...item,
        checked: $event
      };
    });
    this.adminList[type] = list;
  }

  public changeType(event: any, type: any, flag = 0, value = '') {
    let arr = [];
    for(let k of this.adminListAll[type]) {
      if(!flag) {
        k.checked = false;
      }
      if(value === k.value) {
        k.checked = true;
      }
      if(this.edit.userType[type] === k.group) {
        arr.push(k);
      }
    }
    const list = JSON.parse(JSON.stringify(arr));
    this.adminList[type] = list;
    if (list.every(item => item.checked === true)) {
      this.checkedAll[type] = true;
    } else if (list.some(item => item.checked === false)) {
      this.checkedAll[type] = false;
    }
  }

  // 删除类型详情
  public async delCheckUser(item: any) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: async () => {
        let res = await this.api.Http({name: 'delCheckUser', data: {id: item.id}})
        if (res.success) {
          this.getDataList();
          this.message.create('success', res.msg);
        }
      }
    });

  }
  // 添加编辑的类型详情
  public typeChange(event: any) {
    for(let k of this.typeList) {
      if(k['sign'] === event) {
        this.detailList = k['data'];
      }
    }
  }
  // 获取管理组
  public async adminGroupList() {
    const userData = {
      page_index: 1,
      page_size: 100000,
    };
    let res = await this.api.Http({name: 'adminGroupList', data: userData})
    if (res.success) {
      let data = res.data.data;
      let arr = [];
      for(let k of data) {
        arr.push({label: k.name, value: k.id, checked: false});
      }
      this.groupList[0] = JSON.parse(JSON.stringify(arr));
      this.groupList[1] = JSON.parse(JSON.stringify(arr));
      this.groupList[2] = JSON.parse(JSON.stringify(arr));
    }
  }
  // 获取审核类型
  public async getCheckType() {
    let res = await this.api.Http({name: 'getCheckType'})
    if (res.success) {
      this.typeList = res.data;
    }
  }
  // 获取管理员
  public async adminUserList() {
    const userData = {
      page_index: 1,
      page_size: 100000,
    };
    let res = await this.api.Http({name: 'adminUserList', data: userData})
    if (res.success) {
      let data = res.data.data;
      let arr = [];
      for(let k of data) {
        arr.push({label: k.username, value: k.username, checked: false, group: k.group_id});
      }
      this.adminListAll[0] = JSON.parse(JSON.stringify(arr));
      this.adminListAll[1] = JSON.parse(JSON.stringify(arr));
      this.adminListAll[2] = JSON.parse(JSON.stringify(arr));
    }
  }
  // 添加 编辑
  public add(item: any) {
    this.edit.show = true;
    this.edit.type = item;
    this.edit.userType = ['', '', ''];
    this.adminList = [[], [], []];
    for(let k of this.adminList) {
      for(let i of k) {
        i.checked = false;
      }
    }
    for(let k of this.adminListAll) {
      for(let i of k) {
        i.checked = false;
      }
    }
    this.edit.data = {
      id: 0,
      type: '',
      type_detail: '',
      users: ''
    };
    this.detailList = [];

    // 编辑
    if(item) {
      this.edit.data = this.api.filterData(this.edit.data, JSON.parse(JSON.stringify(item)));
      this.typeChange(this.edit.data.type);

      let users = item.users.split('|');
      for (let i = 0; i < users.length; i++) {
        users[i] = users[i] .split(',')
      }
      for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < users[i].length; j++) {
          for(let k of this.adminListAll[i]) {
            if(users[i][j] === k.value) {
              this.edit.userType[i] = k.group;
              this.changeType(0, i, 1, k.value);
            }
          }
        }
      }
    }
  }
  // 提交
  public async submitEdit() {
    let users = [];
    let userList = this.adminList;

    for(let k of userList) {
      let kArr = [];
      for(let i of k) {
          if(i['checked']) {
            kArr.push(i['value']);
          }
      }
      users.push(kArr.join(','))
    }
    let usersIsEmpty = users.some((item) => {
      return item;
    });
    if(!usersIsEmpty) {
      this.modalService.confirm({
        nzTitle: '<i>提示</i>',
        nzContent: '<b>请选管理组！！</b>'
      });
      return;
    }
    if(!this.edit.data.type) {
      this.modalService.confirm({
        nzTitle: '<i>提示</i>',
        nzContent: '<b>请选择类型！！</b>'
      });
      return;
    } else if(this.detailList.length > 0 && this.edit.data.type_detail === '') {
      this.modalService.confirm({
        nzTitle: '<i>提示</i>',
        nzContent: '<b>请选择类型详情！！</b>'
      });
      return;
    }
    this.edit.data.users = users.join('|');

    if(!this.edit.data.type_detail) {
      this.edit.data.type_detail = 0;
    }
    let res = await this.api.Http({name: 'saveCheckUser', data: this.edit.data})
    if (res.success) {
      this.getDataList();
      this.message.create('success', res.msg);
      this.edit.show = false;
     }
    if(!this.edit.type) {
    
     }
  }
  // 获取数据列表
  public async getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
    };
    let res = await this.api.Http({name: 'getCheckUser', data});
    if (res.success) {
      this.page.total = res.data.total;
      this.tableList = res.data;
    }
  }

  // 翻页
  public pageChange() {
    this.getDataList();
  }

}
