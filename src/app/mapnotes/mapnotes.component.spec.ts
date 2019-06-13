import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapnotesComponent } from './mapnotes.component';

describe('MapnotesComponent', () => {
  let component: MapnotesComponent;
  let fixture: ComponentFixture<MapnotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapnotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapnotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
