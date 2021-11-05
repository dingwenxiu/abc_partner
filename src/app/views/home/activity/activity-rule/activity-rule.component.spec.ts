import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityRuleComponent } from './activity-rule.component';

describe('ActivityRuleComponent', () => {
  let component: ActivityRuleComponent;
  let fixture: ComponentFixture<ActivityRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
