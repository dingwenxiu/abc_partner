import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformAccountComponent } from './platform-account.component';

describe('PlatformAccountComponent', () => {
  let component: PlatformAccountComponent;
  let fixture: ComponentFixture<PlatformAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
