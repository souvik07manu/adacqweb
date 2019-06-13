import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminviewgeodataComponent } from './adminviewgeodata.component';

describe('AdminviewgeodataComponent', () => {
  let component: AdminviewgeodataComponent;
  let fixture: ComponentFixture<AdminviewgeodataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminviewgeodataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminviewgeodataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
