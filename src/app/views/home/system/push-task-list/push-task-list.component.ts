import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { ApiSystemService } from '../../../../api/apiSystem.service';
import { ToolService } from '../../../../tool/tool.service';

@Component({
  selector: 'app-push-task-list',
  templateUrl: './push-task-list.component.html',
  styleUrls: ['./push-task-list.component.scss']
})
export class PushTaskListComponent implements OnInit {
  public tableList = [];
  public page = {
    index: 1,
    total: 0
  };

  public addData = {
    show: false,
    buttonLoading: false,
    device_options: {},
    msg_options: {},
    time_options: {},
    data: {
      id: 0,
      push_msg_type: '1',
      push_time_type: '1',
      push_device_type: '1',
      title: '',
      content: '',
      push_time_config: '',
    }
  };

  constructor(
    public api: ApiSystemService,
    public utils: ToolService,
    public modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getDataList();
  }

  // 公告列表
  public getDataList() {
    const data = {
      page_size: this.api.pageSize,
      page_index: 1
    };

    this.api.pushTaskList(data).then( (res: any) => {
      if (res.success) {
        this.tableList = res.data.data;
      }
    });
  }

  // 状态
  public doStatus(id) {
    this.api.pushTaskStatus(id).then((res: any) => {
      if (res.success) {
        this.getDataList();
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '恭喜, 修改成功 !'
        });
      } else {
        const modal = this.modalService.error({
          nzTitle: '温馨提示',
          nzContent: '恭喜, 修改失败 !'
        });
      }
    });
  }

  // 删除
  public doDel(id) {
    this.api.pushTaskDel(id).then((res: any) => {
      if (res.success) {
        this.getDataList();
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '恭喜, 删除成功 !'
        });
      } else {
        const modal = this.modalService.error({
          nzTitle: '温馨提示',
          nzContent: '恭喜, 删除失败 !'
        });
      }
    });
  }

  // 刷新缓存
  public doDetail(id) {
    this.api.pushTaskDetail(id).then((res: any) => {
      if (res.success) {
        this.getDataList();
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '恭喜, 刷新所有缓存成功 !'
        });
      } else {
        const modal = this.modalService.error({
          nzTitle: '温馨提示',
          nzContent: '恭喜, 刷新所有缓存失败 !'
        });
      }
    });
  }

  // 添加公告
  public addTask(id) {
    this.addData.show = true;
  }

  // 提交公告
  public submitTask() {
    this.addData.buttonLoading    = true;
    const data = this.addData.data;
    for (const key in data) {
      if (data[key] == null || data[key] === undefined) {
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '对不起,' + key + '不能为空!'
        });
        return false;
      }
    }

    this.api.pushTaskAdd(this.addData.data.id, data).then((res: any) => {
      if (res.success) {
        this.getDataList();
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '恭喜您, 添加任务成功 !'
        });

        this.addData.buttonLoading = false;
        this.back();
      } else {
        const modal = this.modalService.error({
          nzTitle: '温馨提示',
          nzContent: res.msg
        });
      }

      this.addData.buttonLoading = false;
    }).catch(() => {this.addData.buttonLoading = false; });
  }

  // 回退
  public back() {
    this.addData.show = false;
    this.addData = {
      show: false,
      buttonLoading: false,
      device_options:{},
      msg_options:{},
      time_options:{},
      data: {
        id: 0,
        push_msg_type: '1',
        push_time_type: '1',
        push_device_type: '1',
        title: '',
        content: '',
        push_time_config: '',
      }
    };
  }

  // 翻页
  public pageChange() {
    this.getDataList();
  }
}
