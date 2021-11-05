import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceWithdrawListComponent } from './finance-withdraw-list.component';

describe('FinanceWithdrawListComponent', () => {
  let component: FinanceWithdrawListComponent;
  let fixture: ComponentFixture<FinanceWithdrawListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceWithdrawListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceWithdrawListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
