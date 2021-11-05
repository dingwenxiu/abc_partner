import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ApiService } from '../../../../api/api.service';
import { ToolService } from '../../../../tool/tool.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-group-list',
  templateUrl: './admin-group-list.component.html',
  styleUrls: ['./admin-group-list.component.scss']
})

export class AdminGroupListComponent implements OnInit {
  public listOfParentData: any[] = [];
  public listOfChildrenData: any[] = [];
  public nodes = [
    {
      title: '0-0',
      key: '123',
      expanded: true,
      checked: false,
      children: [
        {
          title: '0-0-0',
          checked: false,
          children: [
            { title: '0-0-0-0', isLeaf: true, checked: false },
            { title: '0-0-0-1', isLeaf: true, checked: false },
            { title: '0-0-0-2', isLeaf: true, checked: false }
          ]
        }
      ]
    }
  ];

  public page = {
    index: 1,
    total: 0
  };

   // 修改权限
  public permissions = {
    all: false,
    id: 0,
    show: false,
    lookShow: false
  };

  // 查看权限
  public lookPermissions = {
    show: false,
    data: [],
    id: '',
    level: 0
  };

  // 添加 编辑分组
  public addAdmin = {
    title: '添加分组',
    show: false,
    type: 0,
    data: {
      name: '',
      id: 0,
      remark: ''
    }
  };

  public partnerOptions: any;

  public indeterminate = [];
  public groupId = '';

  constructor(
    public api: ApiService,
    public message: NzMessageService,
    public modalService: NzModalService,
    private ulits: ToolService,
    private route: Router
  ) { }

  ngOnInit() {
    this.adminGroupList();
    const user = this.ulits.storage.get('user');
    this.groupId = user.data.group_id;
  }
  public updateAllChecked($event, index) {
    const data = {...this.lookPermissions.data[index]};
    if (!this.indeterminate[index] && !data.checked) {
      data.checked = true;
      this.indeterminate[index] = true;
    } else {
      let boo = false;
      if (this.indeterminate[index]) {
        boo = true;
      }
      const childs = data.childs;
      data.childs = childs.map(item => {
        return {
          ...item,
          checked: boo
        };
      });
      this.indeterminate[index] = false;
      data.checked = boo;
    }
    this.lookPermissions.data[index] = data;
  }
  public updateChildAllChecked($event, i1, i2) {
    const obj = this.lookPermissions.data[i1].childs[i2];
    this.lookPermissions.data[i1].checked = true;
    this.indeterminate[i1] = true;
    this.lookPermissions.data[i1].childs[i2].childs = obj.childs.map(item => {
      return {
        ...item,
        checked: $event
      };
    });
    this.lookPermissions.data[i1].childs[i2].checked = $event;
  }
  public updateSingleChecked(index) {
    if (this.lookPermissions.data[index].childs.every(item => item.checked === false)) {
      this.lookPermissions.data[index].checked = false;
      this.indeterminate[index] = false;
    } else if (this.lookPermissions.data[index].childs.every(item => item.checked === true)) {
      this.lookPermissions.data[index].checked = true;
      this.indeterminate[index] = false;
    } else {
      this.lookPermissions.data[index].checked = true;
      this.indeterminate[index] = true;
    }
  }

  // 管理员列表
  public adminGroupList() {
    const optnios = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
    };
    this.api.Http({name: 'adminGroupList', data: optnios}).then( (res: any) => {
      const {data, success} = res;
      if (success) {
        const arr = [];
        for (const key in data['partner_options']) {
          if (key) {
            arr.push({
              key,
              label: data['partner_options'][key]
            });
          }
        }
        this.partnerOptions = arr;
        this.listOfParentData = data['data'];
        this.page.total = data.total;
      }
    });
  }

  // 查看管理员权限
  public adminGroupAclDetail(item: any) {
    this.api.Http({name: 'adminGroupAcl', attach: item.id}).then( (response: any) => {
      if (response.success) {

        if (JSON.stringify(response.data) === '{}' || response.data.length === 0) {
          this.modalService.warning({
            nzTitle: '提示',
            nzContent: '暂无权限！'
          });
          return;
        }
        this.lookPermissions.show = true;
        this.lookPermissions.id = item.id;
        const {data} = response;
        const temp = [];
        for (const parent of data) {
          const parentName = parent.cn_name;
          const parents = {
            label: parentName, value: parentName, checked: parent.checked, childs: [], rid: parent.id
          };
          for (const child of parent.child) {
            const childName = child.cn_name;
            const obj = {
              label: childName, value: childName, checked: child.checked, rid: child.id, childs: []
            };
            if (child.hasOwnProperty('child')) {
              for (const grandson of child.child) {
                const grandsonName = grandson.cn_name;
                const grandsons = {
                  label: grandsonName, value: grandsonName, checked: grandson.checked, rid: grandson.id, childs: []
                };
                obj.childs.push(grandsons);
              }
            }
            parents.childs.push(obj);
          }
          temp.push(parents);
        }
        this.lookPermissions.data = temp;
        this.lookPermissions.level = item.level;
      }
    });
  }

  public setAcl() {
    const menuIds = [];
    for (const value of this.lookPermissions.data) {
      if (value.checked) {
        menuIds.push(value.rid);
        for (const childVal of value.childs) {
          const check = childVal.checked && menuIds.push(childVal.rid);
          if (childVal.childs.length > 0) {
            for (const grandsons of childVal.childs) {
              const pCheck = grandsons.checked && menuIds.push(grandsons.rid);
            }
          }
        }
      }
    }
    this.api.Http({
      name: 'adminGroupSetAcl',
      data: {menu_ids: menuIds},
      attach: this.lookPermissions.id
    }).then((res: any) => {
      this.lookPermissions.show = false;
      this.message.create('success', res.msg);
    });
  }

  // 取消添加管理组
  public closeConfig() {
    this.addAdmin.show = false
    this.addAdmin.data.id = 0;
  }
  // 确认添加管理组
  public confirmConfig() {
    let data = {};
    if (this.addAdmin.type === 0) {
      data = {
        name: this.addAdmin.data.name,
        remark: this.addAdmin.data.remark
      };
    } else {
      data = {
        id: this.addAdmin.data.id,
        name: this.addAdmin.data.name,
        remark: this.addAdmin.data.remark
      };
    }
    this.api.Http({
      name: 'adminGroupAdd',
      data
    }).then( (response: any) => {
      if (response.success) {
        this.addAdmin.show = false;
        this.adminGroupList();
        this.addAdmin.data.name = '';
        this.addAdmin.data.id = 0;
        this.message.create('success', response.msg);
      }
    });
  }
  // 添加 编辑 管理组
  public addAdmins(item: any, type = 0) {
    this.addAdmin.data = {
      name: '',
      id: 0,
      remark: ''
    };
    if (item) {
         // type 为0 是添加
      if (type === 0) {
        this.addAdmin.title = '添加分组';
      } else {
        this.addAdmin.data.name = item.name;
        this.addAdmin.data.id = item.id;
        this.addAdmin.data.remark = item.remark;
        this.addAdmin.title = '编辑分组';
      }
    }
    this.addAdmin.show = true;
    this.addAdmin.type = type;
  }
  // 删除管理组
  public deleteAdmins(item: any) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: () => {
        this.api.Http({name: 'adminGroupDel', attach: item.id}).then( (response: any) => {
          if (response.success) {
            this.adminGroupList();
            this.message.create('success', response.msg);
          }
        });
      }
    });
  }


  public pageChange() {
    this.adminGroupList();
  }
}
