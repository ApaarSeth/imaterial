import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialWiseComponent } from './material-wise.component';

describe('MaterialWiseComponent', () => {
  let component: MaterialWiseComponent;
  let fixture: ComponentFixture<MaterialWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
