import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoDocumentsComponent } from './po-documents.component';

describe('PoDocumentsComponent', () => {
  let component: PoDocumentsComponent;
  let fixture: ComponentFixture<PoDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
