import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentDetailsComponent } from './department-details.component';

describe('DepartmentDetailsComponent', () => {
  let component: DepartmentDetailsComponent;
  let fixture: ComponentFixture<DepartmentDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentDetailsComponent]
    });
    fixture = TestBed.createComponent(DepartmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
