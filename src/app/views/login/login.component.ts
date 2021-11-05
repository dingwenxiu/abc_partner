import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

import { ApiService } from '../../api/api.service';
import { ToolService } from '../../tool/tool.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public validateForm: FormGroup;
  public username = '';
  public password = '';
  public verification = '';
  public rememberPassword = false;
  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    public utils: ToolService,
    public router: Router,
    private modalService: NzModalService,
  ) {
    const rememberPasswords = this.utils.storage.get('rememberPasswords');
    if (rememberPasswords) {
      this.rememberPassword = true;
      this.username = rememberPasswords.data.username;
      this.password = rememberPasswords.data.password;
      // this.submitForm();
    }
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      verification: [null, [Validators.required]],
      remember: [true]
    });
  }

  // 提交登录
  public submitForm() {
    if (
      !this.utils.removeAllSpace(this.username) ||
      !this.utils.removeAllSpace(this.password)
    ) {
      return false;
    }

    if (!this.rememberPassword) {
      // tslint:disable-next-line: forin
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    const data = {
      email: this.username,
      password: this.password,
      code: this.verification
    };
    this.api.Http({name: 'login', data}).then((res: any) => {
      if (res.success) {
        this.utils.storage.set('user', {
          ...res.data,
          API_BASE_URL: environment.apiBaseUrl
        }, 1);
        this.api.imgUrl = res.data['system_pic_base_url'] + '/';
        if (this.rememberPassword) {
          this.utils.storage.set('rememberPasswords', {
            username: this.username,
            password: this.password,
            group_id: res.data.group_id
          });
        } else {
          const rememberPasswords = this.utils.storage.get('rememberPasswords');
          if (rememberPasswords) {
            this.utils.storage.remove('rememberPasswords');
          }
        }
        this.router.navigate(['']);
      }
    });
  }

  // 发送验证码
  public sendCode() {
    const data = {
      email: this.username,
      password: this.password
    };

    this.api.Http({name: 'sendCode', data}).then((res: any) => {
      if (res.success) {
        this.modalService.success({
          nzTitle: '提示',
          nzContent: res.msg
        });
      }
    });
  }
}
