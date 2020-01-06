import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentDetailComponent } from './indent-detail.component';

describe('IndentDetailComponent', () => {
  let component: IndentDetailComponent;
  let fixture: ComponentFixture<IndentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
