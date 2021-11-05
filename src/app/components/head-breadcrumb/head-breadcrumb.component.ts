import { Component, OnInit, Input, AfterViewChecked, AfterContentInit, AfterViewInit, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-head-breadcrumb',
  templateUrl: './head-breadcrumb.component.html',
  styleUrls: ['./head-breadcrumb.component.scss']
})

export class HeadBreadcrumbComponent implements OnInit, AfterViewChecked {
  @Input() breadcrumbList = [];
  public breadcrumb = [];
  constructor() {
  }
  ngOnInit() {
  }
  ngAfterViewChecked() {
    const hash = window.location.hash;
    this.breadcrumbList.map(item => {
      for (const value of item.childs) {
        if (hash.includes(value.api_path)) {
          this.breadcrumb = [item.title, value.title];
          return;
        }
      }
    });
  }
}
