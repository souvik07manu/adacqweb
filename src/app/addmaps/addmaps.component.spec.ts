import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmapsComponent } from './addmaps.component';

describe('AddmapsComponent', () => {
  let component: AddmapsComponent;
  let fixture: ComponentFixture<AddmapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddmapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
