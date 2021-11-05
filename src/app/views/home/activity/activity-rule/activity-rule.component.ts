import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { decode } from 'punycode';

@Component({
  selector: 'app-activity-rule',
  templateUrl: './activity-rule.component.html',
  styleUrls: ['./activity-rule.component.scss']
})
export class ActivityRuleComponent implements OnInit {
  public tableList = [];
  public page = {
    index: 1,
    total: 0
  };

  public testText = '';

  public contentPop = {
    show: false,
    data: ''
  };

  // 编辑 添加
  public edit = {
    type: 0,
    show: false,
    loading: false,
    data: {
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
    }
  }
  // 编辑的所属活动列表
  public activity_options = [];
  // 规则详情
  public rule_details = [
    { field: '', value: '', remark: '' }
  ];
  constructor(
    public api: ApiService,
    public message: NzMessageService,
    public modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getDataList();
  }
  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  // 获取数据列表
  public async getDataList() {
    const optnios = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
    };
    const res = await this.api.Http({ name: 'activityRuleGetList', data: { ...optnios } });
    const { success, data } = res;
    if (success) {
      // const changeKeyArray = ['possible', 'prize', 'obtain_type', 'check', 'home', 'participants', 'params'];
      // data.map((item) => {
      //   for (const key of changeKeyArray) {
      //     item[key] = unescape(item[key].replace(/\\/g, '%'));
      //   }
      // });
      data['showParams'] = JSON.stringify(data.params);
      this.tableList = data;
    }
  }

  public addRuleDetails() {
    this.rule_details.push({ field: '', value: '', remark: '' });
  }
  public reduceHandler(index: any) {
    this.rule_details.splice(index, 1);
  }
  public lockTd($event) {
    const notNode = ['SPAN', 'P'];
    const { target } = $event;
    if (notNode.includes(target.nodeName) && target.id !== 'operating') {
      this.contentPop = {
        show: true,
        data: $event.target.innerText
      };
    }
  }

}
