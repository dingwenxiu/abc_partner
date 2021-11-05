import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityPrizeComponent } from './activity-prize.component';

describe('ActivityPrizeComponent', () => {
  let component: ActivityPrizeComponent;
  let fixture: ComponentFixture<ActivityPrizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityPrizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityPrizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
