import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ToolService } from '../../../../tool/tool.service';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-casino-category-list',
  templateUrl: './casino-category-list.component.html',
  styleUrls: ['./casino-category-list.component.scss']
})
export class CasinoCategoryListComponent implements OnInit {
  public tableList = [];
  public seriesList = {};
  public selectedValue: any;
  public timeCoulDown = false;

  public page = {
    index: 1,
    total: 0
  };

  public searchData = {};

  public editClear = null;

  constructor(
    public utils: ToolService,
    public api: ApiService,
    public router: Router,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getDataList();
  }


  public getDataList() {
    const data = {
      page_size: this.api.pageSize,
      page_index: this.page.index
    };

    this.api.Http({
      name: 'getPlatType',
      data
    }).then((res: any) => {
      if (res && res.success) {
        this.tableList = res.data.categories;
        this.page.total = res.data.total;
      }
    });
  }

  public pageChange() {
    this.getDataList();
  }

  public back() {
    this.getDataList();
  }

  public setShow(id) {
    this.api.Http({name: 'setHomePlat', data: {plat_id: id}}).then((res: any) => {
      this.getDataList();
    });
  }

  public SynchronousData(){
    this.timeCoulDown = true;
    this.api.Http({name: 'seriesLists'}).then((res: any) => {
      let timeCat = 300;
      const timer = setInterval(() => {
        timeCat-- >= 0 ? '' : this.timeCoulDown = false;
      }, 1000);
      this.getDataList();
    });
  }

  public doPageChange() {
    this.getDataList();
  }
}
