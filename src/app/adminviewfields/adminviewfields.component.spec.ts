import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminviewfieldsComponent } from './adminviewfields.component';

describe('AdminviewfieldsComponent', () => {
  let component: AdminviewfieldsComponent;
  let fixture: ComponentFixture<AdminviewfieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminviewfieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminviewfieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
