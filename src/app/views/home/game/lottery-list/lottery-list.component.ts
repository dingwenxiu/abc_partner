import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';

import { CronOptions } from 'cron-editor/cron-editor';

@Component({
  selector: 'app-lottery-list',
  templateUrl: './lottery-list.component.html',
  styleUrls: ['./lottery-list.component.scss']
})
export class LotteryListComponent implements OnInit {
  public tableList = [];
  public seriesId = '';
  public seriesList = [];
  public selectedValue: any;
  public positionOption = [];
  // 弹框步骤条控制
  public stepIndex = 0;
  public selectedIndex = '';
  public iconType = 'pc_pic';
  public min_prize_group = 0;
  public max_prize_group = 10;
  public prize_group: Array<1> = [];
  public validModesOption = [];
  public validPriceOption = [];

  public file_obj: any;
  public file_iri: any;

  public rateData = {
    show:false,
    item:{"lottery_name" : ""},
    id:0,
    data:{
      rate:"",
    }
  };

  public page = {
    index: 1,
    total: 0
  };

  public edit_rule_obj = [{
    id: 1,
    begin_time: new Date('2019-10-10 00:00:00'),
    end_time: new Date('2019-10-10  00:00:00'),
    issue_seconds: 1,
    first_time: new Date('2019-10-10  00:00:00'),
    adjust_time: 0,
    encode_time: 0,
    issue_count: 1,
    status: '0'
  }];

  public editCron = {
    schedule: '00:00:00',
    status: '0',
    command: '',
    param: '',
    remarks: ''
  };

  public edit = {
    show: false,
    submitButton: false,
    id: 0,
    series_options: {},
    valid_code: {},
    checkOptionsOne: [],
    valid_modes: [],
    positions: [],
    data: {
      lottery_name: '',
      lottery_sign: '',
      diff_prize_group: '',
      max_prize_per_issue: '',
      max_prize_group: '',
      min_prize_group: '',
      valid_modes: '',
      icon_path: '',
      valid_price: '',
      ad_img: '',
      is_hot: ''
    }
  };
  public editClear = null;

  public cronOptions: CronOptions = {
    formInputClass: 'form-control cron-editor-input',
    formSelectClass: 'form-control cron-editor-select',
    formRadioClass: 'cron-editor-radio',
    formCheckboxClass: 'cron-editor-checkbox',
    defaultTime: '00:00:00',
    hideMinutesTab: false,
    removeSeconds: false,
    removeYears: false,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: true,
    use24HourTime: true,
    hideSeconds: false
  };
  issueBetOpen: any;

  // 设置热门 和 公告
  constructor(
    public utils: ToolService,
    public api: ApiService,
    public router: Router,
    private message: NzMessageService,
    private modalService: NzModalService
    ) {
      this.getSeriesList();
    }

  ngOnInit() {
    this.editClear = JSON.stringify(this.edit);
  }

  public steps_control(type) {
    type === 'add' ? this.stepIndex++ : this.stepIndex--;
  }

  //  加减
  public maxTraceNumberCount(obj: any, type: any, number = 1, index: any) {
    if (number === 1) {
      if (type === '-') {
        if (+this.edit.data[obj] > 0) {
          +this.edit.data[obj] --;
        }
      } else {
        +this.edit.data[obj] ++;
      }
    } else {
      if (type === '-') {
        if (+this.edit_rule_obj[index][obj] > 0) {
          +this.edit_rule_obj[index][obj] --;
        }
      } else {
        +this.edit_rule_obj[index][obj] ++;
      }
    }
  }

  // 限制输入数字
  public maxTraceNumber(obj: any, type = false, number = 1, index: any) {
    if (number === 1) {
      this.edit.data[obj] = this.number(this.edit.data[obj], type);
    } else {
      this.edit_rule_obj[index][obj] = this.number(this.edit_rule_obj[index][obj], type);
    }
  }

  // 限制 只输入数字 包括不能输入字符和小数点
  private number(str: any, float = false) {
    // float = true 可以输入小数点
    str = String(str);
    if (float) {
      return str.replace(/[^\d.]/g, '').replace(/^0{1,}/g, '');
    } else {
      return str.replace(/[^\d]/g, '').replace(/^0{-1,}/g, '');
    }
  }

  // 投注单位
  public validModesOptions() {
      const result = [
      {
        title: '全选',
        value: '元,角,分,厘',
        key: '1,2,3',
        children: [
          {
            title: '元',
            value: '1',
            key: '1',
            isLeaf: true
          },
          {
            title: '角',
            value: '2',
            key: '2',
            isLeaf: true
          },
          {
            title: '分',
            value: '3',
            key: '3',
            isLeaf: true
          },
          {
            title: '厘',
            value: '4',
            key: '4',
            isLeaf: true
          }
        ]
      }
    ];
      this.validModesOption = result;
  }
  // 一二元模式
  public validPriceOptions() {
    const result = [
    {
      title: '全选',
      value: '一元, 二元',
      key: '1,2',
      children: [
        {
          title: '一元',
          value: '1',
          key: '1',
          isLeaf: true
        },
        {
          title: '二元',
          value: '2',
          key: '2',
          isLeaf: true
        }
      ]
    }
  ];
    this.validPriceOption = result;
}

  public change_prize_group($event) {
    const arr = this.prize_group;
    this.edit.data.min_prize_group = arr[0] + '';
    this.edit.data.max_prize_group = arr[1] + '';
  }

  public selectTab(seriesId) {
    this.seriesId = seriesId;
    this.getDataList();
  }

  public getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
      pid: 0,
      lottery_id: this.selectedValue,
      series_id: this.seriesId
    };

    this.api.Http({
      name: 'lotteryList',
      data
    }).then((res: any) => {
      if (res && res.success) {
        this.edit.series_options = res.data.series_options;
        this.tableList = res.data.data;
        this.edit.series_options = res.data.seriesList;
        this.page.total = res.data.total;
        this.issueBetOpen = res.data.issueBet_open;
      }
    });
  }

  public getSeriesList() {
    this.api.Http({
      name: 'lotteryList',
      data: {}
    }).then((res: any) => {
      const sList = res.data.seriesList;
      const sKey = [];
      for (const key in sList) {
        if ( key ) {
          sKey.push({
            value: key,
            lable: sList[key]
          });
        }
      }
      this.seriesList = sKey;
      this.seriesId = sKey[0].value;
      this.selectedIndex = sKey[0].value;
      this.getDataList();
    });
  }

  public pageChange() {
    this.getDataList();
  }


  // 修改状态
  public doLotteryStatus(item: any, index) {
    this.api.Http({name: 'lotteryStatus', attach: item.en_name}).then((res: any) => {
      if (res.success) {
        item.status = res.data['status'];
        this.tableList[index].status = res.data.status;
        this.message.success(res.msg);
      }
    }).catch(() => { });
  }

  public async submitEdit() {
    if (this.edit.data.lottery_name && this.utils.removeAllSpace(this.edit.data.lottery_name)) {
      const data: any = this.edit.data;
      // 把多选的结果组合成字符串
      const [checkOptionsOne = this.edit.checkOptionsOne, valid_modes = []] = [];
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < checkOptionsOne.length; i++) {
        if (checkOptionsOne[i].checked) {
          valid_modes.push(checkOptionsOne[i].value);
        }
      }
      // data.valid_modes = valid_modes.join(',');

      const option = {
        valid_modes: data.valid_modes + '',
        min_prize_group: data.min_prize_group,
        max_prize_group: data.max_prize_group,
        diff_prize_group: data.diff_prize_group,
        max_prize_per_issue: data.max_prize_per_issue,
        lottery_name: data.lottery_name,
        lottery_sign: data.lottery_sign,
        icon_path: data.icon_path,
        valid_price: data.valid_price + '',
        ad_img: data.ad_img,
        is_hot: data.is_hot
      };

      // 发送数据
      const resonse = await this.api.Http({
        name: 'lotterySet',
        data: option,
        attach: this.edit.data.lottery_sign + ''
      });

      if (resonse.success) {
        const modal = this.modalService.success({
          nzTitle: '提示',
          nzContent: '保存成功 !'
        });
        this.getDataList();
        this.edit.show = false;
        this.edit.data = JSON.parse(this.editClear).data;
      }
    }
  }

  public async details(item?: any, add?: any) {
    this.edit.checkOptionsOne = [];
    if (!add) {
      this.api.Http({
        name: 'lotteryDetail',
        attach: item.en_name
      }).then((res: any) => {
        const {success, data} = res;
        if (success) {
          this.edit.show = true;
          this.edit.data = this.api.filterData(this.edit.data, {
            ...data.lottery,
            valid_modes: data.lottery.valid_modes.split(','),
            valid_price: data.lottery.valid_price.split(',')
          });
          this.edit.positions = data.positions_options;
          this.edit.valid_code = data.valid_code_options;
          this.edit.valid_modes = data.mode_options;
        }
      }).catch(() => { });
    }
    this.positionOptions(item.en_name);
    this.validModesOptions();
    this.validPriceOptions();
  }

  private positionOptions(name) {
    const result = [];
    if (name === 'pk10') {
      const arr = ['0', 1, 2, 3, 4, 5, 6, 7, 8, 9];
      result[0] = {
        title: '全选',
        value: '0,1,2,3,4,5,6,7,8,9',
        key: '0,1,2,3,4,5,6,7,8,9',
        children: [],
        isLeaf: false
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < arr.length; i++) {
        const json = {};
        json['key'] = arr[i];
        json['value'] = arr[i];
        json['title'] = arr[i];
        json['isLeaf'] = true;
        result[0].children.push(json);
      }
    } else if (name === 'lhc') {
      const arr = [1, 2, 3, 4, 5, 6, 7];
      result[0] = {
        title: '全选',
        value: '1,2,3,4,5,6,7',
        key: '1,2,3,4,5,6,7',
        children: [],
        isLeaf: false
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < arr.length; i++) {
        const json = {};
        json['key'] = arr[i];
        json['value'] = arr[i];
        json['title'] = arr[i];
        json['isLeaf'] = true;
        result[0].children.push(json);
      }
    } else {
      let arr = [
        {lable: '万', value: 'w'},
        {lable: '千', value: 'q'},
        {lable: '百', value: 'b'},
        {lable: '十', value: 's'},
        {lable: '个', value: 'g'},
      ];
      result[0] = {
        title: '全选',
        value: '万,千,百,十,个',
        key: 'w,q,b,s,g',
        children: [],
        isLeaf: false
      };
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < arr.length; i++) {
        let json = {};
        json['key'] = arr[i].value;
        json['value'] = arr[i].value;
        json['title'] = arr[i].lable;
        json['isLeaf'] = true;
        result[0].children.push(json);
      }
    }
    this.positionOption = result;
  }

  // 设置热门 和 公告
  public async lotteryHotSet(item: any, type: any) {
    let response = null;

    let data = null;

    if (type === 'hot') {
      data = {
        is_hot: 0
      };
      item.is_hot ? data.is_hot = 1 : data.is_hot = 0;
      response = await this.api.Http({name: 'lotterySet', data, attach: item.id});
    } else {
      data = {
        is_lottery: 0
      };
      item.is_lottery ? data.is_lottery = 1 : data.is_lottery = 0;
      response = await this.api.Http({name: 'changePop', data, attach: item.id});
    }
  }

  // 上传图片
  public upImages(e: any) {
    if (e.type === 'success') {
      this.edit.data.icon_path = e.fileList[0].response.data.path;
    }
  }

  // 删除图片
  public deleteImg() {
    this.edit.data.icon_path = null;
  }

  // 上传广告图片
  public upAdImages(e: any) {
    if (e.type === 'success') {
      this.edit.data.ad_img = e.fileList[0].response.data.path;
    }
  }
  // 删除广告图片
  public deleteAdImg() {
    this.edit.data.ad_img = null;
  }

  // 设置水率
  public setRate(item) {
    this.rateData.id    = item.en_name;
    this.rateData.item.lottery_name  = item.cn_name;
    this.rateData.show  = true;

    this.rateData.data.rate  = item.rate;
  }

  // 设置水率 提交
  public setRateSubmit() {
    this.api.Http({name: 'lotterySetRate', data: this.rateData.data, attach: this.rateData.id + ""}).then((res: any) => {
      if (res.success) {
        this.getDataList();
        this.message.create('success', res.msg);
        this.rateData.show  = false;
      }
    }).catch(() => { });
  }
  // 控水
  public rateOpen(item) {
    this.api.Http({name: 'rateOpen', data: {lottery_sign: item.id}}).then((res: any) => {
      this.getDataList();
      if (res.success) {
        this.message.create('success', res.msg);
      }
    });
  }
}
