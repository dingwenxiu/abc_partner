import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformChannelComponent } from './platform-channel.component';

describe('PlatformChannelComponent', () => {
  let component: PlatformChannelComponent;
  let fixture: ComponentFixture<PlatformChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
