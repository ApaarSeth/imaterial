import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoSupplierComponent } from './po-supplier.component';

describe('PoSupplierComponent', () => {
  let component: PoSupplierComponent;
  let fixture: ComponentFixture<PoSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
