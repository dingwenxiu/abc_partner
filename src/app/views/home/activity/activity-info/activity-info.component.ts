import { Component, OnInit, ViewChild} from '@angular/core';
import { UEditorComponent } from 'ngx-ueditor';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { ApiService } from '../../../../api/api.service';
import { ToolService } from '../../../../tool/tool.service';
import { JsonPipe } from '@angular/common';
// import { parse } from 'path';
@Component({
  selector: 'app-activity-info',
  templateUrl: './activity-info.component.html',
  styleUrls: ['./activity-info.component.scss']
})
export class ActivityInfoComponent implements OnInit {
  @ViewChild('full', {static: false})
  full: UEditorComponent;
  html: string;
  public tableList = [];
  public page = {
    index: 1,
    total: 0
  };

  public cellsList = [];

  // 编辑 添加
  public edit = {
    type: 0,
    show: false,
    loading: false,
    current: 0,
    data: {}
  };

  // 关联规则
  public rule = [];
  public noRule = 0;
        // 规则
  public editRule = null;
  // 显示在 编辑的规则
  public rule_details = {};

  public typeOptions = [];
  public typeOptionsIndex = 0;
  public typeParams = {};
  public dataParams = [{}];
  public possibleParams = [{}];
  // 需要多个奖品设置的活动type
  public prizeSetting = ['checkin', 'turntable', 'first_recharge', 'gift_recharge', 'red_pack_rain', 'turntable_one'];
  // 需要多个条件设置的活动tpye
  public possibleSetting = ['turntable', 'red_pack_rain'];
  public fileList = [];
  public lotteryOption = [];
  public participants = [];
  formatterPercent = (value: number) => `${value} %`;
  parserPercent = (value: string) => value.replace(' %', '');

  constructor(
    public api: ApiService,
    public utils: ToolService,
    public message: NzMessageService,
    public modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getDataList();
  }

  private getLotteryOption() {
    this.api.Http({name: 'lotteryList'}).then((res) => {
      const {success, data} = res;
      if (success) {
        this.lotteryOption = data.data;
        this.edit.show = true;
      }
    });
  }

  public log(value: any): void {
    this.typeParams['participants'] = value.join(',');
  }
  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  // 获取数据列表
  public async getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
    };
    const res = await this.api.Http({name: 'activityInfoList', data});
    if (res.success) {
      this.page.total = res.data.total;
      this.tableList  = res.data.data;
    }
  }

  public participantsData($event, i) {
  }

  public async getRuleTypeOptions() {
    let temp = [];
    const res = await this.api.Http({ name: 'activityRuleGetList'});
    const { success, data } = res;
    if (success) {
      temp = data;
      // for(let k of temp) {
      //   if(k.params && k.params['participants'] && k.params['participants'].data) {
      //     let arr = [];
      //     for(let j of Object.keys(k.params['participants'].data)) {
      //       arr.push({ label: k.params['participants'].data[j], value: j, checked: true })
      //     }

      //     k.params['participants'].data2 = arr;
      //   }
      // }
      this.typeOptions = temp;
      this.getLotteryOption();
    }
  }

  // 添加
  public addHandler() {
    this.edit = {
      type: 0,
      show: false,
      loading: false,
      current: 0,
      data: {}
    }
    this.typeParams = {};
    this.dataParams = [];
    this.possibleParams = [];
    this.getRuleTypeOptions();
  }

  // 编辑
  public async editHandler(item: any) {
    const options = await this.getRuleTypeOptions();
    this.changeType(item.type);
    this.dataParams = [];
    this.edit.type = item.id;
    this.edit.data = item;
    this.edit.current = 0;
    this.typeParams = JSON.parse(item.params);
    if (this.typeParams.hasOwnProperty('participants') && typeof this.typeParams['participants'] !== 'object') {
      this.participants = this.typeParams['participants'].split(',');
    }
    // 活动设置添加
    if (this.prizeSetting.includes(item['type'])) {
      Object.assign(this.dataParams, {...this.typeParams['prize']});
    }
    // 条件设置添加
    if (this.possibleSetting.includes(item['type'])) {
      Object.assign(this.possibleParams, {...this.typeParams['turn_num']});
    }
  }
  // 删除
  public deleteHandler(item: any, index) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: async () => {
        const data = {
          id: item.id
        };
        const response = await this.api.Http({name: 'activityInfoDel', attach: data.id + ''});
        if (response.success) {
          this.message.create('success', response.msg);
          const arr = this.tableList;
          arr.splice(index, 1);
          this.tableList = arr;
        }
      }
    });
  }
  // 选中规则时
  public ruleHandler() {
  }
  // 提交规则
  public async ruleDetailsHandler() {
    let data = {
      id: 0,
      // 名称
      name: null,
      // 规则描述
      description: null,
      // 活动id
      activity_id: 0,
      // 规则详情
      rule_details: null,
      // 规则标记
      rule_sign: null
    };

    data = this.api.filterData(data, this.editRule);
    data.rule_details = JSON.stringify(this.editRule.rule_det);

  }
  // 上传图片
  public upImages(e: any) {
    if (e.type === 'success') {
      this.typeParams['img'] = e.fileList[0].response.data.path;
    }
  }
  // 删除图片
  public deleteImg(type: any) {
    this.typeParams['img'] = null;
  }
  // 上传轮播图片
  public upBannerImages(e: any) {
    if (e.type === 'success') {
      this.edit.data['img_banner'] = e.fileList[0].response.data.path;
    }
  }
  // 删除轮播图片
  public deleteBannerImg(type: any) {
    this.edit.data['img_banner'] = null;
  }
  // 上传列表图片
  public upListImages(e: any) {
    if (e.type === 'success') {
      this.edit.data['img_list'] = e.fileList[0].response.data.path;
    }
  }
  // 删除列表图片
  public deleteListImg(type: any) {
    this.edit.data['img_list'] = null;
  }
   // 上传详情图片
  public upInfoImages(e: any) {
    if (e.type === 'success') {
      this.edit.data['img_info'] = e.fileList[0].response.data.path;
    }
  }
  // 删除详情图片
  public deleteInfoImg(type: any) {
    this.edit.data['img_info'] = null;
  }
  public _ready(e: any) { }
  public _destroy() { }
  public _change(e: any) { }

  public nextStep(step) {
    let { current } = this.edit;
    if (step && current < 3) {
      this.edit.current = ++current;
    } else if (!step && current > 0) {
      this.edit.current = --current;
    }
  }

  public changeType($event) {
    this.typeOptions.forEach((item, index) => {
      if (item.type === $event) {
        this.typeOptionsIndex = index;
        this.typeParams = {};
        return;
      }
    });
  }

  public cellsChangeDays($event) {
    this.dataParams = JSON.parse(JSON.stringify(this.dataParams));
    if ($event >= this.dataParams.length) {
      const num = $event - this.dataParams.length;
      for (let i = 0; i < num ; i++) {
        this.dataParams.push({
          checkin_days: '',
          prize: '',
          prize_value: '',
          obtain_type: '',
          check: ''
        });
      }
    } else {
      const num = this.dataParams.length - $event;
      for (let i = num; i > 0; i--) {
        this.dataParams.splice(this.dataParams.length - 1, 1)
      }
    }
  }

  public cellsChangeTurn($event) {
    const angle = Math.floor(360 / $event);


    this.dataParams = JSON.parse(JSON.stringify(this.dataParams));
    if ($event >= this.dataParams.length) {
      const num = $event - this.dataParams.length;
      for (let i = 0; i < num ; i++) {
        this.dataParams.push({
          prize: 1,
          prize_value: 1,
          probability: 1,
          angle: null
        });
      }
    } else {
      const num = this.dataParams.length - $event;
      for (let i = num; i > 0; i--) {
        this.dataParams.splice(this.dataParams.length - 1, 1)
      }
    }

    for (let i = 0; i < this.dataParams.length ; i++) {
      this.dataParams[i]['angle'] = [i === 0 ? i * angle :  (i * angle) + 1, (i + 1) * angle ]
    }
  }

  public cellsChangeFirst($event: any) {
    this.dataParams = JSON.parse(JSON.stringify(this.dataParams));
    if ($event >= this.dataParams.length) {
      const num = $event - this.dataParams.length;
      for (let i = 0; i < num ; i++) {
        this.dataParams.push({
          possible: '',
          possible_val: '',
          recharge: '',
          give_type: '',
          prize: '',
          prize_value: '',
          obtain_type: '',
          participants: '',
          check: ''
        });
      }
    } else {
      const num = this.dataParams.length - $event;
      for (let i = num; i > 0; i--) {
        this.dataParams.splice(this.dataParams.length - 1, 1)
      }
    }
  }

  public cellsChangeGift($event) {
    this.dataParams = JSON.parse(JSON.stringify(this.dataParams));
    if ($event >= this.dataParams.length) {
      const num = $event - this.dataParams.length;
      for (let i = 0; i < num ; i++) {
        this.dataParams.push({
          possible: '2',
          possible_val: '0',
          recharge: '',
          prize: '',
          prize_value: '',
          obtain_type: '',
          participants: '',
          check: ''
        });
      }
    } else {
      const num = this.dataParams.length - $event;
      for (let i = num; i > 0; i--) {
        this.dataParams.splice(this.dataParams.length - 1, 1);
      }
    }

  }

  public cellsChangeRed($event) {
    this.dataParams = JSON.parse(JSON.stringify(this.dataParams));
    if ($event >= this.dataParams.length) {
      const num = $event - this.dataParams.length;
      for (let i = 0; i < num ; i++) {
        this.dataParams.push({
          prize: '',
          prize_val: '',
          total_num: '',
          winning_num: '',
          max_money: ''
        });
      }
    } else {
      const num = this.dataParams.length - $event;
      for (let i = num; i > 0; i--) {
        this.dataParams.splice(this.dataParams.length - 1, 1)
      }
    }
  }

  public possibleChangeRed($event) {
    if ($event >= this.possibleParams.length) {
      const num = $event - this.possibleParams.length;
      for (let i = 0; i < num ; i++) {
        this.possibleParams.push({
          possible: '',
          possible_val: '',
          red_pack_time: ''
        });
      }
    } else {
      const num = this.possibleParams.length - $event;
      for (let i = num; i > 0; i--) {
        this.possibleParams.splice(this.possibleParams.length - 1, 1);
      }
    }
  }

    // 确认
  public async submitHandler() {
    const data = this.edit.data;
    let url = '';
    if (this.edit.type) {
      // 编辑
      url = 'activityInfoEdit';
    } else {
      // 添加
      url = 'activityInfoAdd';
    }
    for (const k of this.possibleParams) {
      delete k['0'];
      delete k['1'];
    }
    // 活动设置添加
    if (this.prizeSetting.includes(this.edit.data['type'])) {
      Object.assign(this.typeParams, {prize: {...this.dataParams}});
    }
    // 条件设置添加
    if (this.possibleSetting.includes(this.edit.data['type'])) {
      // this.possibleParams.map((item) => {
      //   const lotterySign = item['lottery_sign'];
      //   if (lotterySign) {
      //     item['lottery_sign'] = lotterySign.join();
      //   }
      // });
      Object.assign(this.typeParams, {turn_num: {...this.possibleParams}});
    }

    data['home'] = this.typeParams['home'];
    delete data['status'];
    // 添加
    const response = await this.api.Http({
      name: url,
      data: {
        ...data,
        params: {
          ...this.typeParams
        }
      },
      attach: this.edit.type + ''
    });
    if (response.success) {
      this.message.create('success', response.msg);
      this.edit.show = false;
      this.getDataList();
    }
    this.edit.loading = false;
  }

  public handleChange($event, index) {
    if ($event.type === 'success') {
      this.dataParams[index]['img'] = $event.fileList[0].response.data.path;
    }
  }

  public deleteParamsImg(index) {
    this.dataParams[index]['img'] = null;
  }

  public giveValChange(type, index) {
    if (type === '2') {
      this.dataParams[index]['prize_value'] = this.dataParams[index]['recharge'] * (this.dataParams[index]['give_val'] / 100);
    }
  }
  public giveTypeChange(type, index) {
    if (type === '1') {
      this.dataParams[index]['give_val'] = '1';
    }
  }
}
