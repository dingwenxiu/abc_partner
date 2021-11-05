import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckUserListComponent } from './check-user-list.component';

describe('CheckUserListComponent', () => {
  let component: CheckUserListComponent;
  let fixture: ComponentFixture<CheckUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
