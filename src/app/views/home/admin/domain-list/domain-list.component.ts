import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../api/api.service';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-domain-list',
  templateUrl: './domain-list.component.html',
  styleUrls: ['./domain-list.component.scss']
})

export class DomainListComponent implements OnInit {

  public tableList = [];
  public tplModalButtonLoading = false;

  public page = {
    index: 1,
    total: 0
  };

  public searchData = {
    page_index: 1,
    page_size: 15
  };

  public detail = {
    show: false,
    data: {
      id: '---',
      bank_name: '---',
      bank_sign: '---',
      branch: '---',
      card_number: '---',
      city_id: '---',
      nickname: '---',
      owner_name: '---',
      province_id: '---'
    }
  };

  constructor( public api: ApiService, private modalService: NzModalService ) {

  }

  // 初始化
  ngOnInit() {
    this.getDataList();
  }

  public doDetails(item: any) {
    this.detail.show = true;
    if (item.content) {
      if (typeof item.content === 'string') {
        this.detail.data = JSON.parse(item.content).data;
      } else {
        this.detail.data = item.content.data;
      }
    }
  }
  // 页面变更
  public doPageChange() {
    this.getDataList();
  }

  public getDataList() {
    const data = {
      page_index: this.page.index,
      page_size: this.api.pageSize,
    };

    this.api.Http({name: 'domainList', data}).then((res: any) => {
      if (res.success) {
        this.page.total = res.data.total;
        this.tableList  = res.data.data;
      }
    });
  }

  public addDomain(type) {
    const data = {};
    this.api.Http({name: 'domainAdd', data}).then((res: any) => {});
  }

  public setStatus(item, index) {
    this.api.Http({name: 'domainStatus', attach: item.id}).then((res: any) => {
      const {success, msg} = res;
      const modal = this.modalService.success({
        nzTitle: '温馨提示',
        nzContent: msg
      });
      this.tableList[index]['status'] = item.status;
    });
  }
}
