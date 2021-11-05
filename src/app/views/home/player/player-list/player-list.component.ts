import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { NzModalService } from 'ng-zorro-antd';
import { ToolService } from '../../../../tool/tool.service';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})

export class PlayerListComponent implements OnInit {
  public tableList = [];
  public tplModalButtonLoading = false;
  public frozenAll = false;
  public searchParentId = '';
  public searchParentData = {};
  public userTypeOptions = {};
  public frozenTypeOptions = {};
  public parentSet = [];
  public parentId = [];
  public dateRange: any;
  public page = {
    index: 1,
    total: 0
  };

  public withdrawMark = {
    id: '',
    show: false,
    mark: '',
    loading: false
  }

  // vip等级
  public playerVipLevel = {
    show: false,
    data: {
      id: '',
      vip_level: ''
    }
  }
  // 查询数据
  public searchData = {
    page_index: 1,
    page_size: 20
  };

  public salarySetPop = {
    show: false,
    parent: {},
    type: 0,
    max: 0,
    min: 0,
    data: {
      id: 0,
      salary_percentage: ''
    }
  };

  public bonusSetPop = {
    show: false,
    parent: {},
    type: 0,
    max: 0,
    min: 0,
    data: {
      id: 0,
      bonus_percentage: ''
    }
  };

  public transferFromPop = {
    show: false,
    id: '',
    data: {
      amount: ''
    }
  };

  // 资金
  public fund = {
    show: false,
    fundSubmitButton: false,
    transfer_reduce_options: {},
    transfer_add_options: {},

    username: '',
    balance: 0,

    id: 0,

    add_data: {
      mode: 'add',
      type: null,
      amount: 0,
      password: '',
      reason: ''
    },

    reduce_data: {
      mode: 'reduce',
      type: null,
      amount: 0,
      password: '',
      reason: ''
    }
  };

  // 密码
  public password = {
    show: false,
    submitButton: false,

    username: '',
    nickname: '',
    user_frozen: '',
    id: 0,

    login_data: {
      mode: 'login',
      admin_fund_password: '',
      password: '',
      confirm_password: '',
      desc: ''
    },

    fund_data: {
      admin_fund_password: '',
      password: '',
      confirm_password: '',
      desc: ''
    }
  };

  // 编辑
  public addTopData = {
    show: false,
    id: 0,
    data: {
      fund_password: '',
      is_test: 0,
      username: '',
      password: '',
      prize_group: 1960,
      phone: ''
    }
  };
  public mapOfExpandData: { [key: string]: boolean } = {};

  // 冻结
  public frozen = {
    show: false,
    id: '',
    desc: '',
    frozen: null,
    type: false,
    frozenSubmitButton: false
  };

  // 详情
  public detail = {
    show: false,
    player: {
      id: '',
      username: '',
      nickname: '',
      mobile: '',
      vip_level: 1,
      parent_id: '',
      invite_code: '',
      frozen_type: '',
      register_ip: '',
      register_time: '',
      register_device: '',
      register_city: '',
      last_login_ip: '',
      last_login_time: '',
      totalRechargeCount: 0,
      totalRechargeAmount: 0,
      totalWithdrawCount: 0,
      totalWithdrawAmount: 0,
      salary_percentage: '',
      bonus_percentage: ''
    },
    account: {
      balance: 0,
      frozen_balance: 0,
    },
    stat: {
      recharge: 0,
      withdraw: 0,
      manual_recharge: 0,
      manual_reduce: 0,
      send_packet_count: 0,
      send_packet_amount: 0,
      fetched_packet_count: 0,
      fetched_packet_amount: 0,
      system_ms_amount: 0,
      system_brokerage: 0,
      landmine_amount_in: 0,
      landmine_amount_out: 0,
    },
    cards: [],
    last10RechargeOrder: [],
    last10WithdrawOrder: [],
    lastSendPackets: {},
    lastFetchPackets: {},
    parentSet: [],
    qr_img: '',
    qr_link: ''
  };
  public findSelf = {};

  // 解除冻结
  public unFrozen = {
    show: false,
    id: '',
    desc: '',
    type: false,
    fundSubmitButton: false,
    frozenType: ''
  };

  public phoneVerify = false;
  public parserPercent = (value: number) => Math.floor(value) + ''.replace(' %', '');
  public formatterPercent = (value: number) => `${value} %`;
  public salaryParserPercent = (value: string) => {
    const num = value.replace(' %', '').split('.');
    if (num[1] && num[1].length > 1) {
      return `${num[0]}.${num[1].slice(0, 1)}`;
    }
    return value.replace(' %', '');
  }
  public salaryFormatterPercent = (value: number) => `${Number(value).toFixed(1)} %`;

  constructor(public api: ApiService, public toolService: ToolService, private modalService: NzModalService) {

  }

  // 初始化
  ngOnInit() {
    this.getDataList();
  }

  // 设置会员等级
  public async setPlayerVipLevel(data: any) {
    if(!data) {
      let res = await this.api.Http({ name: 'setPlayerVipLevel', data: this.playerVipLevel.data});
      if(res.success) {
        this.getDataList();
        this.playerVipLevel.show = false;
      }
    } 
    // 打开vip设置等级
    else {
      this.playerVipLevel.data['id'] = data['id'];
      this.playerVipLevel.show = true;
    }
  }
  // 寻找下级
  public findChild(data: any, flag = false) {
    this.searchData = {
      page_index: 1,
      page_size: 20
    };
    this.searchParentId = data.id;
    this.searchParentData = data;
    // const indexPlus = this.searchParentData === 0 ? 2 : 1;
    // if (this.searchParentData === 0) {
    //   this.parentSet = [];
    //   this.parentId = [];
    // } else {
    //   const index = this.parentId.indexOf(this.searchParentData['id']);
    //   if (index !== -1) {
    //     this.parentId.splice(index + indexPlus, 999);
    //     this.parentSet.splice(index + indexPlus , 999);
    //   } else {
    //     this.parentId.push(this.searchParentData['id']);
    //     this.parentSet.push({id: this.searchParentData['id'], username: this.searchParentData['username']});
    //   }
    // }
    this.tableList.forEach((item) => {
      if (item.id === data.id) {
        this.findSelf = item;
        return true;
      }
    });
    this.getDataList(flag);
  }

  // 回退
  public back() {
    this.closeAll();
    this.initPasswordData();
  }

  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  // 关闭所有
  public closeAll() {
    this.detail.show = false;
    this.addTopData.show = false;
    this.fund.show = false;
    this.frozen.show = false;
    this.password.show = false;
    this.unFrozen.show = false;
  }

  // 添加直属
  public initEditData() {
    this.addTopData.data = {
      fund_password: '',
      is_test: 0,
      username: '',
      password: '',
      prize_group: 1960,
      phone: ''
    };
  }

  // 添加直属
  public addTop() {
    this.addTopData.show = true;
    this.phoneVerify = false;
    this.initEditData();
  }

  // 添加直属 = 提交
  public async submitAddTop() {
    const data = this.addTopData.data;
    this.phoneVerify = false;
    for (const key in data) {
      if (data[key] == null || data[key] === undefined) {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '对不起,' + key + '不能为空!'
        });
        return false;
      }
    }
    this.phoneVerify = !/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.addTopData.data.phone) && this.addTopData.data.phone !== '';
    if (this.phoneVerify) {
      // const modal = this.modalService.success({
      //   nzTitle: '温馨提示',
      //   nzContent: '手机号码格式不正确'
      // });
      return;
    }
    const response = await this.api.Http({ name: 'playerAddTop', data });
    if (response.success) {
      this.getDataList();
      const modal = this.modalService.success({
        nzTitle: '温馨提示',
        nzContent: '恭喜您, 添加成功 !'
      });
      this.initEditData();
      this.back();
    }

  }

  // 理赔扣减
  public initFundData() {
    this.fund = {
      show: false,
      fundSubmitButton: false,
      transfer_reduce_options: {},
      transfer_add_options: {},

      username: '',
      balance: 0,

      id: 0,

      add_data: {
        mode: 'add',
        type: null,
        amount: 0,
        password: '',
        reason: ''
      },

      reduce_data: {
        mode: 'reduce',
        type: null,
        amount: 0,
        password: '',
        reason: ''
      }
    };
  }

  // 资金相关
  public doTransfer(id: any) {
    this.closeAll();
    this.initFundData();
    this.fund.id = id;
    this.api.Http({ name: 'playerTransfer', data: { action: 'option' }, attach: id + '' }).then((res: any) => {
      this.fund.show = true;
      const { data } = res;
      Object.assign(this.fund, data);
    });
  }

  // 提交
  public async submitTransfer(mode: any) {

    // 设置模式
    // tslint:disable-next-line:triple-equals
    const data = mode === 'add' ? this.fund.add_data : this.fund.reduce_data;
    for (const key in data) {
      if (data[key] == null || data[key] === undefined) {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '对不起,' + key + '不能为空!'
        });
        return false;
      }
    }

    const response = await this.api.Http({ name: 'playerTransfer', data, attach: this.fund.id + '' });
    // 提交
    if (response.success) {
      this.getDataList();
      const modal = this.modalService.success({
        nzTitle: '温馨提示',
        nzContent: response.msg,
        nzOnOk: () => {
          this.initFundData();
          this.back();
        }
      });
    }
  }

  /** ================ 修改状态 =============== */
  // 状态
  public doStatus(item: any, i) {
    this.api.Http({ name: 'playerStatus', attach: item + '' }).then((res: any) => {
      const { success, msg } = res;
      const modal = this.modalService.success({
        nzTitle: '温馨提示',
        nzContent: msg
      });
      this.tableList[i].status = !this.tableList[i].status;
    });
  }

  // 获取数据列表
  public getDataList(flag = false) {
    const data = {};
    Object.assign(data, this.searchData);
    if (this.searchParentId) {
      data['parent_id'] = this.searchParentId;
    }
    this.api.Http({ name: 'playerList', data }).then((res: any) => {
      if (res.success) {

        this.userTypeOptions = res.data.type_options;
        this.frozenTypeOptions = res.data.frozen_type_options;

        if (this.searchParentId === '') {
          this.page.total = res.data.total;
          this.tableList = res.data.data;
          return;
        }
        // const bool = (this.searchParentId !== '' && res.data.data.length > 0);
        const bool = this.searchParentId !== '';
        // if (bool || res.data.data.length > 0) {
        if (bool) {
          this.page.total = res.data.total;
          this.tableList = res.data.data;
          const indexPlus = this.searchParentData === 0 ? 2 : 1;
          this.parentSet = [];
          this.parentId = [];
          if (this.searchParentData === 0) {
            this.searchParentId = '';
          } else {
            const index = this.parentId.indexOf(this.searchParentData['id']);
            if (index !== -1 && flag) {
              this.parentId.splice(index + indexPlus, 999);
              this.parentSet.splice(index + indexPlus, 999);
            } else if (this.searchParentData['id'] !== undefined) {
              const parentData = res.data['parent'];
              if (parentData && parentData.length > 0) {
                for (const k of parentData) {
                  const json = {};
                  json['id'] = k['topParent_id'];
                  json['username'] = k['topParent_name'];
                  this.parentSet.push(json);
                }
              }
              this.parentId.push(this.searchParentData['id']);
              this.parentSet.push({ id: this.searchParentData['id'], username: this.searchParentData['username'] });

              if (res.data.data.length === 0) {
                this.tableList.push(this.findSelf);
              }
            }
          }
        }
        // if (this.searchParentId !== '' && res.data.data.length < 1) {
        //   const modal = this.modalService.success({
        //     nzTitle: '温馨提示',
        //     nzContent: '已经没有下级了 !'
        //   });
        //   this.searchParentId = '';

        // }
      }
    });
  }

  // 获取数据列表
  public resetSearch() {
    this.searchData = {
      page_index: 1,
      page_size: 20
    };
    this.dateRange = null;
    this.parentSet = [];
    this.parentId = [];
    this.searchParentId = '';
    this.getDataList();
  }

  public serach() {
    this.searchData.page_index = 1;
    this.getDataList();
  }

  /** ================ 用户详情 =============== */
  // 查看详情
  doDetail(item: any) {

    this.password.id = item.id;

    this.api.Http({ name: 'playerDetail', attach: item.id }).then((res: any) => {
      if (res.success) {
        this.detail.show = true;
        this.detail.player = res.data.player;
        this.detail.account = res.data.account;

        if (res.data.cards) {
          this.detail.cards = res.data.cards;
        }

        this.detail.parentSet = res.data.parentSet;
        this.detail.last10RechargeOrder = res.data.last10RechargeOrder;
        this.detail.last10WithdrawOrder = res.data.last10WithdrawOrder;

        if (res.data.stat) {
          this.detail.stat = res.data.stat;
        }

      } else {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: res.data.msg
        });
      }
    });
  }

  /** ================ 密码修正 =============== */
  // 初始化密码数据
  public initPasswordData() {
    this.password = {
      show: false,
      submitButton: false,

      username: '',
      nickname: '',
      user_frozen: '未冻结',
      id: 0,
      login_data: {
        mode: 'login',
        admin_fund_password: '',
        password: '',
        confirm_password: '',
        desc: ''
      },
      fund_data: {
        admin_fund_password: '',
        password: '',
        confirm_password: '',
        desc: ''
      }
    };
  }

  // 修改密码
  doPassword(item: any) {
    this.closeAll();
    this.password.id = item.id;
    if (true) {
      this.password.show = true;
      if ('res.data.player') {
        this.password.username = item.username;
        this.password.nickname = item.nickname;
      }
    } else {
      const modal = this.modalService.success({
        nzTitle: '温馨提示',
        nzContent: 'res.data.msg'
      });
    }
  }

  // 提交密码
  submitPassword(mode: any) {
    // tslint:disable-next-line:triple-equals
    const data = mode === 'login' ? this.password.login_data : this.password.fund_data;
    this.api.Http({ name: 'playerPassword', data, attach: this.password.id + '' }).then((res: any) => {
      if (res.success) {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: res.msg,
          nzOnOk: () => {
            this.initPasswordData();
            this.back();
          }
        });

      }
    });
  }

  // 冻结
  doFrozen(id: any) {
    this.closeAll();
    this.frozen.show = true;
    this.frozen.id = id;
  }

  // 提交冻结
  submitFrozen() {
    this.frozen.frozenSubmitButton = true;
    const { desc, frozen, type } = this.frozen;
    if (desc === '') {
      const modal = this.modalService.success({
        nzTitle: '温馨提示',
        nzContent: '对不起,描述不能为空!'
      });
      return false;
    }
    const data = {
      desc,
      frozen
    };
    const bool = type ? Object.assign(data, { type: 'frozenAll' }) : null;
    this.api.Http({ name: 'playerFrozen', data, attach: this.frozen.id }).then((res: any) => {
      if (res.success) {
        this.getDataList();
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: res.msg,
          nzOnOk: () => {
            this.frozen = {
              show: false,
              id: '',
              desc: '',
              frozen: '0',
              type: null,
              frozenSubmitButton: false
            };
            this.back();
            this.getDataList();
          }
        });
      } else {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: res.msg
        });
      }
    });

  }

  // 解除冻结
  doUnFrozen(data: any) {
    this.closeAll();
    this.unFrozen.show = true;
    this.unFrozen.id = data.id;
    this.unFrozen.frozenType = data.frozen_type;
  }

  // 提交解冻
  submitUnFrozen() {
    this.unFrozen.fundSubmitButton = true;
    const { desc, type } = this.unFrozen;
    if (desc === '') {
      const modal = this.modalService.success({
        nzTitle: '温馨提示',
        nzContent: '对不起,描述不能为空!'
      });
      return false;
    }
    const data = {
      desc
    };
    const bool = type ? Object.assign(data, { type: 'frozenAll' }) : null;
    this.api.Http({ name: 'playerUnfrozen', data, attach: this.unFrozen.id }).then((res: any) => {
      if (res.success) {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: res.msg,
          nzOnOk: () => {
            this.unFrozen = {
              show: false,
              id: '',
              desc: '',
              type: null,
              fundSubmitButton: false,
              frozenType: ''
            };
            this.back();
            this.getDataList();
          }
        });
      } else {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: res.msg
        });
      }
    });

  }

  // 日期选择框
  public onChange(result: Date): void {
    this.searchData['start_time'] = this.toolService.formatTime(result[0], 'YYYY-MM-DD HH:MM:SS');
    this.searchData['end_time'] = this.toolService.formatTime(result[1], 'YYYY-MM-DD HH:MM:SS');
  }

  // 点击时间选项框
  public timeHandle() {
    this.dateRange = [this.toolService.timeInit(), this.toolService.timeInit('???')];
  }
  // 打开提现备注
  public doPlayerMark(item) {
    this.withdrawMark = {
      id: item.id,
      show: true,
      mark: '',
      loading: false
    };
  }

  public playerMark() {
    this.withdrawMark.loading = true;
    this.api.Http({ name: 'playerMark', data: { mark: this.withdrawMark.mark }, attach: this.withdrawMark.id + '' }).then((res: any) => {
      const { success } = res;
      if (success) {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '提交成功！'
        });
        this.getDataList();
        this.withdrawMark.show = false;
        this.withdrawMark.loading = false;
      }
    });
  }

  // 代理分红
  public doBonusSet(player) {
    this.bonusSetPop.data.id = player.id;
    this.bonusSetPop.type = player.type;
    this.api.Http({ name: 'bonusSet', data: { action: 'option' }, attach: this.bonusSetPop.data.id + '' }).then((res: any) => {
      const { success } = res;
      if (success) {
        this.bonusSetPop.parent = res.data.parent;
        this.bonusSetPop.data.bonus_percentage = res.data.bonus_percentage;
        this.bonusSetPop.min = res.data.min;
        this.bonusSetPop.max = res.data.max;
        this.bonusSetPop.show = true;
      } else {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '设置成功！'
        });
      }
    });
  }

  public submitBonus() {
    this.api.Http({ name: 'bonusSet', data: { ...this.bonusSetPop.data }, attach: this.bonusSetPop.data.id + '' }).then((res: any) => {
      const { success } = res;
      if (success) {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '设置成功！'
        });
        this.getDataList();
        this.bonusSetPop = {
          show: false,
          parent: {},
          type: 0,
          max: 0,
          min: 0,
          data: {
            id: 0,
            bonus_percentage: ''
          }
        };
      }
    });
  }

  // 代理日工资
  public doSalarySet(player) {
    this.salarySetPop.data.id = player.id;
    this.salarySetPop.type = player.type;
    this.api.Http({ name: 'salarySet', data: { action: 'option' }, attach: this.salarySetPop.data.id + '' }).then((res: any) => {
      const { success } = res;
      if (success) {
        this.salarySetPop.parent = res.data.parent;
        this.salarySetPop.data.salary_percentage = res.data.salary_percentage;
        this.salarySetPop.min = res.data.min;
        this.salarySetPop.max = res.data.max;
        this.salarySetPop.show = true;
      } else {
        const modal = this.modalService.warning({
          nzTitle: '温馨提示',
          nzContent: '获取配置信息失败！'
        });
      }
    });
  }

  public submitSalary() {
    this.api.Http({ name: 'salarySet', data: {
      ...this.salarySetPop.data,
      salary_percentage: Number(this.salarySetPop.data.salary_percentage).toFixed(1)
    }, attach: this.salarySetPop.data.id + '' }).then((res: any) => {
      const { success } = res;
      if (success) {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '设置成功！'
        });
        this.getDataList();
        this.salarySetPop.show = false;
      }

      this.salarySetPop = {
        show: false,
        parent: {},
        type: 0,
        max: 0,
        min: 0,
        data: {
          id: 0,
          salary_percentage: ''
        }
      };
    });
  }


  // 上级转账
  public doTransferFrom(id) {
    this.transferFromPop = {
      show: true,
      id,
      data: {
        amount: ''
      }
    };
  }

  public submitTransferFrom() {
    this.api.Http({
      name: 'transferFrom',
      data: {
        ...this.transferFromPop.data
      },
      attach: this.transferFromPop.id + ''
    }).then((res: any) => {
      const { success, msg } = res;
      if (success) {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: `${msg}！`
        });
        this.transferFromPop.show = false;
      }
    });
  }

  // 上下级转账开关
  public allowedTransfer(id) {
    this.api.Http({ name: 'allowedTransfer', attach: id + '' }).then((res: any) => {
      const { msg, success } = res;
      const modal = this.modalService.success({
        nzTitle: '温馨提示',
        nzContent: `${msg}！`
      });
      if (success) {
        this.getDataList();
      }
    });
  }

  public update(value) {
    this.phoneVerify = !/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value);
  }
}
