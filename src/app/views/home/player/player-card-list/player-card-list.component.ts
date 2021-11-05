import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { NzMessageService, NzModalService} from 'ng-zorro-antd';
import { ToolService } from '../../../../tool/tool.service';

@Component({
  selector: 'app-player-card-list',
  templateUrl: './player-card-list.component.html',
  styleUrls: ['./player-card-list.component.scss']
})

export class PlayerCardListComponent implements OnInit {
  public tableList = [];
  public tplModalButtonLoading = false;
  // public edit = {
  //   show: false,
  //   type: 0,
  //   data: {id: 0},
  //   bank_options: [],
  //   province_options: []
  // };

  public page = {
    index: 1,
    total: 0
  };

  public partnerOption  = {};
  public bankSignOption = [];
  public provinceSelected = [0, 0];
  public edit = {
    type: 0,
    show: false,
    province_options: {},
    bank_options: [],
    data: {
      id: '',
      bank_sign: 'icbc',
      bank_name: '',
      owner_name: '',
      card_number: '',
      province_id: '1',
      city_id: '1',
      branch: '',
      fund_password: ''
    }
  };

  // 查询
  public searchData = {
    page_index: 1,
    page_size: 20
  };

  constructor(
    public api: ApiService, public toolService: ToolService, private modalService: NzModalService, public message: NzMessageService ) {
  }

  // 初始化
  ngOnInit() {
    this.getDataList();
    this.getDetail();
  }

  // 回退
  public back() {
    this.edit.show = false;
  }

  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  /** ========================== 添加 银行卡 ======================== */
  // 初始化银行卡
  public initCard() {
    this.provinceSelected = [0, 0];
    this.edit.data = {
      id: '',
      owner_name: '',
      card_number: '',
      province_id: '1',
      city_id: '1',
      branch: '',
      bank_sign: 'icbc',
      fund_password: '',
      bank_name: '',
    };
  }

  /** ========================== 修改 银行卡 状态 ======================== */
  public doStatus(item: any) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: () => {
        this.api.Http({name: 'cardStatus', attach: item.id}).then((res: any) => {
          const {success} = res;
          if (success) {
            this.message.create('success', '恭喜, 操作成功 !');
            this.getDataList();
          }
        });
      }
    });
  }

  /** ========================== 获取 银行卡 列表 ======================== */
  public getDataList(search = false) {
    const data = {
      ...this.searchData,
      page_index: this.page.index
    };
    this.tableList = [];
    this.api.Http({name: 'playerCardList', data}).then((res: any) => {
      if (res.success) {
        this.page.total = res.data.total;
        const dataList = res.data.data;
        dataList.map(item => {
          const pid = item.province_id;
          const cid = item.city_id;
          item.area = this.toolService.searchArea(this.edit.province_options, pid, cid);
        });
        if(search) {
          this.tableList = dataList;
        } else {
          for(let k of dataList) {
            if (+k['status'] !== 0) {
              this.tableList.push(k)
            }
          }
        }
        const signArray = [];
        for (const key in res.data.bank_list) {
          if (key) {
            signArray.push({key, label: res.data.bank_list[key]});
          }
        }
        this.bankSignOption = signArray;
      }
    });
  }

  // 编辑银行卡
  public getEdit(item: any) {
    this.edit.show = true;
    this.edit.type = 1;
    this.edit.data = this.api.filterData(this.edit.data, item);
  }
  public getDetail(id = '0') {
    this.api.Http({name: 'playerCardDetail', attach: id}).then((res: any) => {
      const {data, success} = res;
      if (success) {
        const [pid, cid] = [data.card.province_id,  data.card.city_id];
        this.provinceSelected = [pid - 0, cid - 0];
        const bankarr = [];
        for (const key in res.data.bank_options) {
          if (key) {
            bankarr.push({key, value: res.data.bank_options[key]});
          }
        }
        this.edit = {
          show: id !== '0' ? true : false,
          type: 1,
          data: this.api.filterData(this.edit.data, data.card),
          province_options: data.province_options,
          bank_options: bankarr
        };
      }
    });
  }

  public search() {
    let num = 0;
    let flag = false;
    for(let k of Object.keys(this.searchData)) {
      num++;
    }
    if (num > 2) {
      flag = true;
    }
    this.getDataList(flag);
  }

  public resetSearch() {

    this.searchData = {
      page_index: 1,
      page_size: 15
    };
    this.search();
  }

  public onProvinceChanges($event) {
    this.provinceSelected = $event;
    this.edit.data.province_id = $event[0];
    this.edit.data.city_id = $event[1];
  }

  public async submitAddFrom() {
    const {type, data} = this.edit;
    if (data.fund_password === '') {
      const modal = this.modalService.error({
        nzTitle: '温馨提示',
        nzContent: '资金密码不能为空'
      });
      return;
    }
    if ( type === 0) {
      const res = await this.api.Http({name: 'playerCardAdd', data, attach: data.id})
      if (res.success) {
        this.getDataList();
        this.edit.show = false;
        this.message.create('success', res.msg);
      }
    } else {
      const res = await this.api.Http({name: 'playerCardEdit', data, attach: this.edit.data.id})
      if (res.success) {
        this.getDataList();
        this.edit.show = false;
        this.message.create('success', res.msg);
      }
    }
  }
}
