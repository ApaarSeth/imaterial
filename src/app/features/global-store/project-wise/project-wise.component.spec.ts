import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWiseComponent } from './project-wise.component';

describe('ProjectWiseComponent', () => {
  let component: ProjectWiseComponent;
  let fixture: ComponentFixture<ProjectWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
