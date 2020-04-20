import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMaterialComponent } from '../my-material.component';

describe('MyMaterialComponent', () => {
  let component: MyMaterialComponent;
  let fixture: ComponentFixture<MyMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyMaterialComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
