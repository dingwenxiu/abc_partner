import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformAccountChannelComponent } from './platform-account-channel.component';

describe('PlatformAccountChannelComponent', () => {
  let component: PlatformAccountChannelComponent;
  let fixture: ComponentFixture<PlatformAccountChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformAccountChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformAccountChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
