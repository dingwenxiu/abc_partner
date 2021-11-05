import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService, UploadFile } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UEditorComponent } from 'ngx-ueditor';
import { element } from 'protractor';
@Component({
  selector: 'app-system-module-list',
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.scss']
})
export class ModuleListComponent implements OnInit {
  @ViewChild('full', { static: false })
  full: UEditorComponent;
  public tableList = [];
  public tabIndex: number;
  public otherList = [];
  public otherOptions = [];
  public homeContentList = [];
  public otherIndex = 0;
  public maxLength: string;

  public otherData = {
    route: '',
    name: '',
    param: ''
  };

  public inputUrlType = true;
  public removeIndex: any;

  // logo
  public logoUrl = {
    pc2Url: '',
    pc1Url: '',
    h1Url: '',
    h2Url: ''
  };
  public logoFileList = [];
  public logoType = 'logo_image_pc_2';
  public logoIndex = 0;
  // 二维码
  public codeUrl = '';
  public codeFileList = [];
  public codeType = 'qr_code_2';
  public codeIndex = 0;
  public telegramPop = {
    show: false,
    type: '',
    data: {}
  };

  public cs = {
    show: false,
    id: '0',
    data: {}
  };
  public csListData = {
    id: '',
    cs_url: ''
  };

  public switchOff = ['hot', 'popular', 'recommend_open_lottery'];
  public color = '';
  // 添加 编辑 导航菜单
  public navEdit = {
    show: false,
    type: 0,
    data: {
      id: 0,
      // 菜单名字
      name: '',
      // 导航跳转地址
      url: null,
      // 1 普通菜单  2是娱乐城
      style: '1',
      // 是娱乐城才显示输入项
      casino_plat_id: '',
      // 状态
      home: 0
    }
  };

  // 娱乐城平台列表
  public casino_options = [];

  // 添加 编辑 导航菜单
  public indexModuleEdit = {
    show: false,
    style: 0,
    max: [],
    data: {
      m_name: '',
      module_id: '',
      other_id: null,
      order: null
    }
  };

  // 首页菜单排序
  public partnerAdminNavigationModifys = {
    show: false,
    sort: null,
    data: {}
  };
  // 首页模块排序
  public indexModule = {
    show: false,
    data: {}
  };

  public logoFileName = {
    logo_image_pc_2: 'PC其他',
    logo_image_pc_1: 'PC',
    logo_image_h5_2: '移动端其他',
    logo_image_h5_1: '移动端',
    logo_icon: '首页icon'
  };

  public logoFileNameArray = [];
  public codeFileName = {
    qr_code_2: 'IOS',
    qr_code_1: '安卓'
  };

  public codeFileNameArray = [];
  public uploadName = '';

  public telegramList = [];
  public telegramData = {
    show: false,
    id: 0,
    data: {
      channel_group_name: ''
    }
  };

  public user: any;
  public otherValues = [];
  public mNameList = ['热门玩法', '推荐开奖', '推荐体育'];
  public uploadTWO = ['推荐视讯', '推荐电游', '推荐棋牌', '推荐体育'];

  public logoUrls = {};
  public codeUrls = {};
  public colorList = [];
  public colorValueList = [];
  public themeStatus = false;
  public random = 0;

  public advertisingList = [];
  public advertisingType = [];
  public advertisingPop = {
    show: false,
    data: {}
  };
  advertisingModel: any;
  public changeAdvertising = {};
  advertisingGame: any;
  advertisingGameOptions: any;
  public searchAdvertising = {};
  public advertisingModule = [];
  constructor(
    public utils: ToolService,
    public api: ApiService,
    public router: Router,
    public message: NzMessageService,
    public modalService: NzModalService
  ) {
    this.logoFileNameArray = Object.keys(this.logoFileName);
    this.codeFileNameArray = Object.keys(this.codeFileName);
  }

  ngOnInit() {
    this.getLogo();
    const user = this.utils.storage.get('user');
    if (user && user.data) {
      this.user = user.data;
    }
    this.random = Math.random();
  }
  // public changeLogoFileType($event) {
  //   this.uploadName = this.logoFileName[$event];
  //   this.logoIndex = Object.keys(this.logoFileName).indexOf($event);
  // }
  // public changeCodeFileType($event) {
  //   this.uploadName = this.codeFileName[$event];
  //   this.codeIndex = Object.keys(this.codeFileName).indexOf($event);
  // }
  // 切换tab
  public changeTabset($event: any) {
    const { index } = $event;
    this.tableList = [];
    switch (index) {
      case 0:
        this.getLogo();
        break;
      case 1:
        this.getQRcode();
        break;
      case 2:
        this.getNavList();
        break;
      case 3:
        this.homeList();
        break;
      case 4:
        this.getCsList();
        break;
      case 5:
        this.getTelegramList();
        break;
      case 6:
        this.getColorConfigureList();
        break;
      case 7:
        this.getType();
        this.getAdvertising();
        break;
    }
  }

  private seatchOption(data: Array<object>, key: string, value: string): object {
    for (const item of data) {
      if (item[key] === value) {
        return item;
      }
    }
  }
  // 广告位图片搜索功能
  public searchAdvertisingType($event) {
    const data = this.seatchOption(this.advertisingType, 'key', $event);
    this.searchAdvertising['type'] = data['key'];
    this.advertisingModule = data['module'];
    this.searchAdvertising['module_sign'] = '';
  }
  public reSearchAdvertisingModule() {
    this.searchAdvertising = {};
  }
  public searchAdvertisingModule($event) {
    const data = this.seatchOption(this.advertisingModule, 'key', $event);
    this.searchAdvertising['module_sign'] = data['key'];
  }
  // 广告位图片添加
  public changeAdvertisingType($event) {
    const data = this.seatchOption(this.advertisingType, 'key', $event);
    this.advertisingPop.data['type'] = data['key'];
    this.advertisingPop.data['type_name'] = data['name'];
    this.advertisingModel = data['module'];
  }

  public changeAdvertisingModule($event) {
    const data = this.seatchOption(this.advertisingModel, 'key', $event);
    this.advertisingPop.data['module_sign'] = data['key'];
    this.advertisingPop.data['module_name'] = data['name'];
    const pid = data['pid'];
    this.advertisingPop.data['sign'] = null;
    this.advertisingPop.data['sign_name'] = '';
    this.advertisingGame = pid;
    this.advertisingPop.data['pid'] = pid ? pid : 0 ;
    this.advertisingPop.data['game_id'] = '';
    if (pid) {
      this.getadvertisingGameOptions(pid);
    }
  }

  public changeAdvertisingSign($event) {
    const data = this.seatchOption(this.advertisingGameOptions, 'other_id', $event);
    this.advertisingPop.data['sign'] = data['other_id'];
    this.advertisingPop.data['sign_name'] = data['lottery_name'];
    this.advertisingPop.data['game_id'] = data['id'];
  }

  public setAdvertising(item = { id: 0 }) {
    if (item.id) {
      this.advertisingGame = item['pid'];
      const data1 = this.seatchOption(this.advertisingType, 'key', item['type']);
      this.advertisingModel = data1['module'];
      if (item['pid']) {
        this.getadvertisingGameOptions(item['pid']);
      }
    }
    this.advertisingPop = {
      show: true,
      data: { ...item }
    };
  }

  private getadvertisingGameOptions(pid) {
    this.api.Http({ name: 'partnerAdminHomeContentList', attach: pid}).then((res: any) => {
      this.advertisingGameOptions = res.data;
    });
  }

  public getAdvertising() {
    const options = {
      ...this.searchAdvertising
    }
    this.api.Http({ name: 'getAdvertising', data: {...options} }).then((res) => {
      const { success, data } = res;
      if (success) {
        this.advertisingList = [...data];
      }
    });
  }

  public saveAdvertising() {
    const option = {
      ...this.advertisingPop.data
    };
    this.api.Http({ name: 'saveAdvertising', data: { ...option } }).then(res => {
      const { success, msg } = res;
      if (success) {
        this.getAdvertising();
        this.message.success(msg);
        this.advertisingPop = {
          show: false,
          data: {}
        };
      }
    });
  }

  public delAdvertising(id) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确定要删除吗？</b>',
      nzOnOk: async () => {
        this.api.Http({ name: 'delAdvertising', data: { id } }).then(res => {
          const { success, msg } = res;
          if (success) {
            this.message.success(msg);
            this.getAdvertising();
          }
        });
      }
    });
  }

  public getType(id = 0) {
    this.api.Http({ name: 'getType', data: { id } }).then((res) => {
      const { success, data } = res;
      if (success) {
        this.advertisingType = [...data];
      }
    });
  }

  public upAdverImage(e) {
    console.log(e);
    if (e.type === 'success') {
      this.advertisingPop.data['img'] = e.fileList[e.fileList.length - 1].response.data.path;
    }
  }

  public deleteAdverImage() {
    this.advertisingPop.data['img'] = '';
  }

  public colorChange($event, i, item) {
    this.colorList[i].value = $event;
    this.addColor(item, $event);
  }

  public colorSet(i) {
    document.getElementById('colorInput' + i).click();
  }

  public getColorConfigureList() {
    this.api.Http({ name: 'colorConfigureList' }).then((res) => {
      this.colorList = res.data;
    });
  }

  public addColor(item, color) {
    if (!color) {
      this.message.info('请选择颜色');
      return;
    }
    this.api.Http({ name: 'colorConfigureEdit', data: { id: item.id, sign: item.partner_sign, color } }).then((res) => {
      const { success, msg } = res;
      if (success) {
        this.message.success(msg);
        this.getColorConfigureList();
        this.colorValueList = [];
      }
    });
  }

  public deleteColor(item) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确定要删除吗？</b>',
      nzOnOk: async () => {
        this.api.Http({ name: 'colorConfigureDelete', data: { id: item.id, sign: item.partner_sign } }).then((res) => {
          const { success, msg } = res;
          if (success) {
            this.message.success(msg);
            this.getColorConfigureList();
          }
        });
      }
    });
  }

  // public getPlayerAvatarList() {
  //   this.api.Http({name: 'playerAvatarList'}).then((res) => {
  //     this.avatarImage = '999';
  //   });
  // }

  // public upAvatarImages($event) {
  //   if ($event.type === 'success') {
  //     this.avatarImage = $event.fileList[0].response.data.path;
  //     this.api.Http({name: 'setAvatar', data: {avatar: ''}}).then((res) => {
  //       this.avatarImage = '999';
  //     });
  //   }
  // }

  // public avatarImgDel() {
  //   this.modalService.confirm({
  //     nzTitle: '<i>提示</i>',
  //     nzContent: '<b>确认删除吗？</b>',
  //     nzOnOk: async () => {
  //       this.api.Http({name: 'avatarImgDel', data: {id: this.user.user_id}}).then((res) => {
  //         this.avatarImage = null;
  //       });
  //     }
  //   });
  // }

  // 清除缓存
  public cleanHandler() {
    this.api.Http({ name: 'partnerAdminCacheClean' });
  }

  public getLogo() {
    // this.uploadName = 'PC其他';
    this.api.Http({ name: 'logoImage', data: { type: this.logoType } }).then((res: any) => {
      const { data } = res;
      this.logoUrls = data;
      // this.random = Math.random();
      // const fileName = this.logoFileName;
      // const fileList = [];
      // for (const value of Object.keys(fileName)) {
      //   if (value) {
      //     fileList.push({
      //       uid: value,
      //       name: fileName[value],
      //       status: 'done',
      //       url: data[value],
      //       thumbUrl: data[value]
      //     });
      //   }
      // }
      // this.logoFileList = [...fileList];
    });
  }
  public getQRcode() {
    // this.codeFileList = [];
    // this.uploadName = 'IOS';
    this.api.Http({ name: 'qrImage', data: { type: this.codeType } }).then((res: any) => {
      const { data } = res;
      this.codeUrls = data;
      // this.random = Math.random();
      // const fileName = this.codeFileName;
      // const fileList = [];
      // const err = data === null && (data = {});
      // for (const value of Object.keys(fileName)) {
      //   if (value) {
      //     fileList.push({
      //       uid: value,
      //       name: fileName[value],
      //       status: 'done',
      //       url: data[value],
      //       thumbUrl: data[value]
      //     });
      //   }
      // }
      // this.codeFileList = [...fileList];
    });
  }
  // logo上传图片
  public logoUpImages(e: any, type) {
    // this.logoIndex = Object.keys(this.logoFileName).indexOf(type);
    // this.uploadName = this.logoFileName[type];
    this.logoUrls[type] = '';
    if (e.type === 'success') {
      // this.logoFileList.splice(this.logoIndex, 1, {
      //   uid: type,
      //   name: this.uploadName,
      //   status: 'done',
      //   url: e.file.response.data.path,
      //   thumbUrl: e.file.response.data.path
      // });
      this.random = Math.random();
      this.logoUrls[type] = e.file.response.data.path;
    }
  }

  // 二维码上传图片
  public codeUpImages(e: any, type) {
    // this.codeIndex = Object.keys(this.codeFileName).indexOf(type);
    // this.uploadName = this.codeFileName[type];
    this.codeUrls[type] = '';
    if (e.type === 'success') {
      // this.codeFileList.splice(this.codeIndex, 1, {
      //   uid: type,
      //   name: this.uploadName,
      //   status: 'done',
      //   url: e.file.response.data.path,
      //   thumbUrl: e.file.response.data.path
      // });
      this.random = Math.random();
      this.codeUrls[type] = e.file.response.data.path;
    }
  }
  // 二维码删除图片
  public codeDeleteImg() {
    this.codeUrl = null;
  }

  public partnerAdminHomeModuleSet(item) {
    if (!this.maxLength) {
      this.modalService.error({
        nzTitle: '提示',
        nzContent: `长度不能为空`
      });
      return;
    }
    if (this.homeContentList.length + '' >= this.maxLength) {
      this.modalService.error({
        nzTitle: '提示',
        nzContent: `当前个数大于设置个数`
      });
      return;
    }
    this.api.Http({ name: 'partnerAdminHomeModuleSet', data: { num_max: this.maxLength }, attach: item.id + '' }).then(res => {
      this.api.Http({ name: 'partnerAdminHomeList' }).then((response: any) => {
        const { data } = response;
        this.otherList = data;
      });
    });
  }

  public handleChangeLogo($event: any) {
    if ($event.type === 'success') {
      this.getLogo();
    }
  }

  public changeTab(index: any) {
    this.tabIndex = index;
  }

  // 导航菜单列表
  public async getNavList() {
    const response = await this.api.Http({ name: 'partnerAdminNavigationList' });
    if (response.success) {
      this.tableList = response.data;
    }
  }
  // 编辑菜单列表
  public async editNavList() {
    const response = await this.api.Http({ name: 'partnerAdminNavigationSet' });
    if (response.success) {
    }
  }
  // 添加菜单列表
  public async addNavList(item: any) {
    // 获取娱乐城列表
    const response = await this.api.Http({ name: 'getPlatType' });
    if (response.success) {
      const temp = [];
      for (const k of response.data.plat_form) {
        const json = { label: k.name, value: k.id, checked: false };
        temp.push(json);
      }
      this.casino_options = temp;
    }

    if (!item) {
      this.navEdit.type = 0;
      this.navEdit.data = {
        id: 0,
        name: '',
        url: '',
        style: '1',
        casino_plat_id: '',
        home: 0
      };
    } else {
      this.navEdit.type = item.id;
      this.navEdit.data = this.api.filterData(this.navEdit.data, item);
      this.navEdit.data.style = '' + this.navEdit.data.style;
      if (+item.style === 2) {
        for (const k of item.platM) {
          for (const j of this.casino_options) {
            if (+k.id === +j.value) {
              j.checked = true;
            }
          }
        }
      }
    }
    this.navEdit.show = true;
  }
  // 删除菜单列表
  public deleteNavList(item: any, index) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: async () => {
        const response = await this.api.Http({ name: 'partnerAdminNavigationDel', attach: '' + item.id });
        if (response.success) {
          this.message.create('success', response.msg);
          this.removeIndex = index;
          setTimeout(() => {
            this.removeIndex = null;
            this.tableList.splice(index, 1);
          }, 500);
        }
      }
    });
  }
  // 提交菜单列表
  public async confrimNavList() {
    // tslint:disable-next-line: variable-name
    let casino_plat_id = '';
    for (const k of this.casino_options) {
      if (k.checked) {
        casino_plat_id += k.value + ',';
      }
    }
    this.navEdit.data.home ? this.navEdit.data.home = 1 : this.navEdit.data.home = 0;
    this.navEdit.data.casino_plat_id = casino_plat_id.substr(0, casino_plat_id.length - 1);
    const data = this.navEdit.data;

    let id = null;
    if (this.navEdit.type) {
      id = this.navEdit.data.id;
    } else {
      id = this.navEdit.type;
    }

    const response = await this.api.Http({ name: 'partnerAdminNavigationSet', data, attach: '' + id });
    if (response.success) {
      this.message.create('success', response.msg);
      this.getNavList();
      this.navEdit.show = false;
    }
  }
  // 首页菜单排序
  public partnerAdminNavigationSet(id: any, order: any) {
    if (+order === 0) {
      this.modalService.error({
        nzTitle: '提示',
        nzContent: '排序不能为0'
      });
      return;
    }
    const data = {
      casino_plat_id: this.partnerAdminNavigationModifys.data['casino_plat_id'],
      order
    };
    this.api.Http({ name: 'partnerAdminNavigationSet', data, attach: id + '' }).then((res: any) => {
      if (res.success) {
        this.message.create('success', res.msg);
        this.partnerAdminNavigationModifys.show = false;
        this.getNavList();
      }
    });
  }
  // 首页模块排序
  public partnerAdminNavigationModify(data: any) {
    this.partnerAdminNavigationModifys.show = true;
    this.partnerAdminNavigationModifys.data = data;
  }

  // 首页模块排序
  public indexModuleSet(id: any, order: any) {
    const data = {
      order,
      other_id: this.indexModule.data['other_id'],
      module_id: this.indexModule.data['module_id']
    };
    this.api.Http({ name: 'partnerAdminHomeSet', data, attach: this.indexModule.data['id'] + '' }).then((res: any) => {
      if (res.success) {
        this.message.create('success', res.msg);
        this.indexModule.show = false;
        this.getNavList();
      }
    });
  }
  // 首页菜单排序
  public indexModuleModify(data: any) {
    this.indexModule.show = true;
    this.indexModule.data = data;
  }

  // 获取首页模块列表
  private homeList() {
    this.api.Http({ name: 'partnerAdminHomeList' }).then((res: any) => {
      const { data } = res;
      this.otherList = data;
      this.changeOther(data[this.otherIndex]);
    });
  }

  // 获取模块内容
  public getHomeContentList(id) {
    this.homeContentList = [];
    this.api.Http({ name: 'partnerAdminHomeContentList', attach: id }).then((res: any) => {
      const { data } = res;
      this.homeContentList = data;
    });
  }

  // 首页模块内容切换
  public changeOtherTabset($event) {
    const { index } = $event;
    this.otherIndex = index || 0;
  }

  public async changeOther(item) {
    this.otherData['showName'] = item.name;
    this.otherData.route = item.route;
    this.otherData.param = item.param;
    this.getHomeContentList(item.id);
  }

  // 热门玩法搜索
  public otherSearch() {
    let datas = {};
    if (this.otherData.param) {
      datas = { ...JSON.parse(this.otherData.param) };
    }
    this.api.post(
      `/partner-api/${this.otherData.route}`,
      { ...datas, method_group: 'QW', cn_name: this.otherData.name }).then((res: any) => {
        const { data } = res;
        const options = data instanceof Array ? data : data.data;
        if (this.indexModuleEdit.data['m_name'] === 'hot') {
          const otherOptions = [
            {
              value: '0',
              label: '体育彩票',
              children: []
            },
            {
              value: '1',
              label: '福利彩票',
              children: []
            }
          ];
          for (const item of options) {
            otherOptions[item.is_fast].children.push({
              value: item.id,
              label: item.cn_name,
              isLeaf: true
            });
          }
          this.otherOptions = otherOptions;
          return;
        }
        this.otherOptions = options;
      });
  }

  // 添加首页模块列表
  public async addIndexModuleList(item: any) {
    this.indexModuleEdit.data = {
      m_name: item.m_name,
      module_id: item.id + '',
      other_id: null,
      order: null
    };
    this.otherValues = [];
    const numArray = [];
    for (let i = 1; i <= item.num_max; i++) {
      numArray.push(i);
    }
    this.indexModuleEdit.max = numArray;
    this.otherValues = [];
    this.indexModuleEdit.style = item.style;
    this.indexModuleEdit.show = true;
    this.otherSearch();
  }

  // 提交首页模块列表
  public async confrimIndexModuleList() {
    const addData = {};
    Object.assign(addData, { ...this.indexModuleEdit.data });
    if (!this.homeContentList.every(item => item.order !== this.indexModuleEdit.data.order)) {
      this.modalService.error({
        nzTitle: '提示',
        nzContent: `该排列已经存在`
      });
      return;
    }
    for (const key in addData) {
      if (!addData[key]) {
        this.modalService.error({
          nzTitle: '提示',
          nzContent: `必填项,${key}不能为空`
        });
        return;
      }
    }
    this.api.Http({ name: 'partnerAdminHomeSet', data: { ...addData }, attach: '0' }).then((res: any) => {
      const id = addData['module_id'];
      this.getHomeContentList(id);
      this.indexModuleEdit.show = false;
    });
  }

  // 删除首页模块列表
  public deleteIndexModuleList(item: any, index) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: () => {
        this.api.Http({ name: 'partnerAdminHomeDel', attach: '' + item.id }).then(res => {
          const id = this.otherList[this.otherIndex].id;
          this.removeIndex = index;
          setTimeout(() => {
            this.removeIndex = null;
            this.homeContentList.splice(index, 1);
          }, 500);
        });
      }
    });
  }

  public memoryLogoIndex(i) {
    this.logoIndex = i;
  }

  public removeLogo(item, i) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: async () => {
        this.api.Http({ name: 'logoDel', data: { type: item } }).then((res: any) => {
          const { success } = res;
          if (success) {
            this.logoUrls[item] = '';
            this.modalService.success({
              nzTitle: '提示',
              nzContent: `删除成功`
            });
          }
        });
      }
    });
  }

  // removeLogo = (file: UploadFile) => {
  //   this.modalService.confirm({
  //     nzTitle: '<i>提示</i>',
  //     nzContent: '<b>确认删除吗？</b>',
  //     nzOnOk: async () => {
  //       const {status, url, uid} = file;
  //       if (status === 'removed') {
  //         this.api.Http({name: 'logoDel', data: {logo_info: url}}).then((res: any) => {
  //           const {success} = res;
  //           if (success) {
  //             this.getLogo();
  //             this.modalService.success({
  //               nzTitle: '提示',
  //               nzContent: `删除成功`
  //             });
  //           }
  //         });
  //       }
  //     }
  //   });
  // }

  public removeCode(item, i) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: async () => {
        this.api.Http({ name: 'qrCodeDel', data: { type: item } }).then((res: any) => {
          const { success } = res;
          if (success) {
            this.codeUrls[item] = '';
            this.modalService.success({
              nzTitle: '提示',
              nzContent: `删除成功`
            });
          }
        });
      }
    });
  }
  // removeCode = (file: UploadFile) => {
  //   this.modalService.confirm({
  //     nzTitle: '<i>提示</i>',
  //     nzContent: '<b>确认删除吗？</b>',
  //     nzOnOk: async () => {
  //       const {status, url, uid} = file;
  //       if (status === 'removed') {
  //         this.api.Http({name: 'qrCodeDel', data: {qrCode: url}}).then((res: any) => {
  //           const {success} = res;
  //           if (success) {
  //             this.getQRcode();
  //             this.modalService.success({
  //               nzTitle: '提示',
  //               nzContent: `删除成功`
  //             });
  //           }
  //         });
  //       }
  //     }
  //   });
  // }

  // 设置客服
  public csSet() {
    const data = {};
    const httpFirst = ['http:', 'https:'];
    Object.assign(data, { ...this.cs.data });
    const url = data['cs_url'];
    if (!httpFirst.includes(url.split('//')[0])) {
      this.modalService.error({
        nzTitle: '错误',
        nzContent: `请输入正确地址, 需以http:// 或 https:// 开头`
      });
      return;
    }
    this.api.Http({ name: 'csSet', data, attach: this.cs.id }).then((res: any) => {
      this.cs.show = false;
      this.getCsList();
    });
  }

  // 客服列表
  public getCsList() {
    this.api.Http({ name: 'csList' }).then((res: any) => {
      const { success, data } = res;
      if (success && data) {
        this.csListData = data;
      }
    });
  }

  // 添加客服
  public csAdd() {
    this.cs = {
      show: true,
      id: '0',
      data: {}
    };
  }

  // 编辑客服
  public csEdit(item) {
    this.cs = {
      show: true,
      id: item.id,
      data: { cs_url: item.cs_url }
    };
  }

  public changeInputUrlType() {
    this.inputUrlType = !this.inputUrlType;
  }

  // 机器人设置
  public getTelegramList() {
    this.api.Http({ name: 'telegramList' }).then((res: any) => {
      const { success, data } = res;
      if (success) {
        this.telegramList = data;
      }
    });
  }

  public telegramEdit(item) {
    this.telegramData.show = true;
    this.telegramData.id = item.id;
    this.telegramData.data.channel_group_name = item.channel_group_name;
  }

  public telegramEditSubmit() {
    this.api.Http({ name: 'telegramEdit', data: this.telegramData.data, attach: this.telegramData.id + '' }).then((res: any) => {
      const { success, data } = res;
      if (success) {
        this.telegramData.show = false;
        this.getTelegramList();
      } else {
        this.modalService.error({
          nzTitle: '错误',
          nzContent: res.msg
        });
      }
    });
  }

  // 生成ID
  public telegramGenId(id) {
    this.api.Http({ name: 'telegramGenId', attach: id }).then((res: any) => {
      const { success, data } = res;
      if (success) {
        this.getTelegramList();
      } else {
        this.modalService.error({
          nzTitle: '错误',
          nzContent: res.msg
        });
      }
    });
  }

  public showHelp() {
  }

  onChanges(values: any): void {
    this.indexModuleEdit.data['other_id'] = values[1];
  }

  // 上传图片
  public upImage(e: any, index) {
    if (e.type === 'success' && e.fileList[0].response.success) {
      // this.edit.data.icon_path = e.fileList[0].response.data.path;
      this.homeContentList[index].ad_img = e.fileList[0].response.data.path;
    }
  }

  // 删除图片
  public delete(item, index) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确定要删除吗？</b>',
      nzOnOk: async () => {
        this.api.Http({ name: 'lotteryAdImgDelete', data: { lottery_sign: item.lottery_sign } }).then((res) => {
          if (res.success) {
            const modal = this.modalService.success({
              nzTitle: '温馨提示',
              nzContent: res.msg
            });
            this.homeContentList[index].ad_img = '';
          }
        });
      }
    });
  }

  // 删除图片
  public deleteTwo(item, index) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确定要删除吗？</b>',
      nzOnOk: async () => {
        this.api.Http({ name: 'adImgDelete', data: { id: item.method_id } }).then((res) => {
          if (res.success) {
            const modal = this.modalService.success({
              nzTitle: '温馨提示',
              nzContent: res.msg
            });
            this.homeContentList[index].ad_img = '';
          }
        });
      }
    });
  }
}
