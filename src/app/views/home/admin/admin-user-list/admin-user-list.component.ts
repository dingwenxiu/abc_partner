import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService  } from 'ng-zorro-antd';
import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';
import { HomeComponent } from '../../../home/home.component';
@Component({
  selector: 'app-admin-user-list',
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.scss']
})

export class AdminUserListComponent implements OnInit {
  public tableList = [];
  public passwordTab = 0;
  public passwordShow = false;
  public groupOptions = [];

  public loginPasswords = {
    submitLoading: false,
    id: 0,
    data: {}
  };

  public fundPasswords = {
    submitLoading: false,
    id: 0,
    data: {}
  };

  public page = {
    index: 1,
    total: 0
  };

  public edit = {
    show: false,
    submitLoading: false,
    id: 0,
    partner_options: [],
    data: {
      username: '',
      email: '',
      group_id: null,
      password: '',
      fund_password: ''
    }
  };

  public deletePop = {
    show: false,
    admin_fund_password: '',
    id: ''
  };

  public editClear = null;
  public groupId = '';
  constructor(
    public utils: ToolService,
    public api: ApiService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private home: HomeComponent
  ) { }

  ngOnInit() {
    this.getDataList();
    this.adminGroupList();
    this.editClear = JSON.stringify(this.edit);
    const user = this.utils.storage.get('user');
    this.groupId = user.data.group_id;
  }

  // 添加管理
  public addAdmin(id: any) {
    this.edit.show = true;
    this.edit.data = {
      username: '',
      email: '',
      group_id: null,
      password: '',
      fund_password: ''
    };
  }
  // 提交
  public submitEdit() {
    const data = this.edit.data;
    for (const key in data) {
      if (!this.utils.removeAllSpace(data[key])) {
        return false;
      }
    }
    this.api.Http({
      name: 'adminUserAdd',
      data
    }).then((res: any) => {
      if (res.success) {
        this.edit.show = false;
        this.getDataList();
        const modal = this.modalService.success({
          nzTitle: '提示',
          nzContent: '添加成功 !'
        });
      }
    });
  }

  // 获取数据列表
  public getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
    };
    this.api.Http({
      name: 'adminUserList'
    }).then((res: any) => {
      if (res.success) {
        this.page.total = res.data.total;
        this.tableList = res.data.data;
      }
    });
  }

  // 管理员列表
  public adminGroupList() {
    this.api.Http({ name: 'adminGroupList', data: {} }).then((res: any) => {
      const options = [];
      const { data } = res;
      for (const item of data.data) {
        options.push({ value: item.id, label: item.name });
      }
      this.groupOptions = options;
    });
  }

  // 翻页
  public pageChange() {
    this.getDataList();
  }

  public back() {
    this.edit.show = false;
    this.passwordShow = false;
    this.getDataList();
  }

  // 修改状态
  public changeStatus(item: any, index: any) {
    this.api.Http({
      name: 'adminUserStatus',
      attach: item.id
    }).then((res: any) => {
      const { success, msg } = res;
      this.getDataList();
      if (success) { this.tableList[index]['status'] = !item.status; }
    });
  }

  // 修改密码开始
  public changePassword(id: any) {
    this.passwordShow = true;
    this.fundPasswords.id = id;
    this.loginPasswords.id = id;

    this.loginPasswords.data = {};
    this.fundPasswords.data = {};
  }

  public submitChangePassword(type: any) {
    let data = null;
    let id = 0;
    if (type === 1) {
      data = this.loginPasswords.data;
      id = this.loginPasswords.id;
      for (const key in data) {
        if (!this.utils.removeAllSpace(String(data[key]))) {
          return false;
        }
      }
      this.api.Http({ name: 'setAdminPassword', data, attach: id + '' }).then((res: any) => {
        const { success, msg } = res;
        if (success) {
          const modal = this.modalService.success({
            nzTitle: '温馨提示',
            nzContent: msg
          });
          this.passwordShow = false;
        }
      });
    } else {
      data = this.fundPasswords.data;
      id = this.fundPasswords.id;
      for (const key in data) {
        if (!this.utils.removeAllSpace(String(data[key]))) {
          return false;
        }
      }
      this.api.Http({ name: 'setAdminFundPassword', data, attach: id + '' }).then((res: any) => {
        const { success, msg } = res;
        if (success) {
          const modal = this.modalService.success({
            nzTitle: '温馨提示',
            nzContent: msg
          });
          this.passwordShow = false;
        }
      });
    }
  }

  public deleteUser(id) {
    this.deletePop = {
      show: true,
      admin_fund_password: '',
      id
    };
  }

  public subDeleteUser() {
    this.api.Http({
      name: 'delAdminUser',
      data: {
        admin_fund_password: this.deletePop.admin_fund_password
      },
      attach: `/${this.deletePop.id}`
    }).then((res) => {
      const { success } = res;
      if (success) {
        this.getDataList();
        this.deletePop = {
          show: false,
          admin_fund_password: '',
          id: ''
        };
      }
    });
  }

  // 上传头像图片
  public upImage(e: any, type, id) {
    if (e.type === 'success') {
      // this.logoUrls[type] = e.file.response.data.path;
      this.getDataList();
      if (id === this.home.user.user_id) {
        this.home.avatar = e.file.response.data.path;
      }
      this.api.random = Math.random();
    }
  }

  public delete(data, i) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确定要删除吗？</b>',
      nzOnOk: async () => {
        this.api.Http({name: 'adminAvatarImgDel', attach: `/${data.id}`}).then(res => {
          const {success, msg} = res;
          if (success) {
            this.message.success(msg);
            this.tableList[i].avatar = null;
          }
        });
      }
    });
  }
}
