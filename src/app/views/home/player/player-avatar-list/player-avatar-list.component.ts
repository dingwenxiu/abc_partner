import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { NzMessageService, NzModalService} from 'ng-zorro-antd';
import { ToolService } from '../../../../tool/tool.service';

@Component({
  selector: 'app-player-avatar-list',
  templateUrl: './player-avatar-list.component.html',
  styleUrls: ['./player-avatar-list.component.scss']
})

export class PlayerAvatarListComponent implements OnInit {
  public fileList = [];
  public avatarImgUrl = '';
  public avatarImgList = [];
  public user: unknown;
  constructor(
    public api: ApiService,
    public toolService: ToolService,
    private modalService: NzModalService,
    public message: NzMessageService ) {
  }

  // 初始化
  ngOnInit() {
    this.getAvatar();
    const user = this.toolService.storage.get('user');
    if (user && user.data) {
      this.user = user.data;
    }
  }

  public getAvatar() {
    this.api.Http({name: 'playerAvatarList'}).then((res) => {
      this.avatarImgList = res.data;
    });
  }

    // 上传详情图片
  public upavatarImgUrl($event: any) {
    if ($event.type === 'success') {
      const fileList = $event.fileList;
      this.api.Http({name: 'setAvatar', data: {avatar: fileList[fileList.length - 1].response.data.path}}).then(() => {
        this.getAvatar();
      });
    }
  }
  // 删除详情图片
  public deleteavatarImgUrl(item) {
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>确认删除吗？</b>',
      nzOnOk: async () => {
        this.api.Http({ name: 'avatarImgDel', data: { id: item.id } }).then((res) => {
          const {success} = res;
          if (success) {
            for (const key in this.avatarImgList) {
              if (this.avatarImgList[key].id === item.id) {
                this.avatarImgList.splice(+key, 1);
              }
            }
          }
        });
      }
    });
  }
}
