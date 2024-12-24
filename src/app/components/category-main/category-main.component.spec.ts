import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryMainComponent } from './category-main.component';

describe('CategoryMainComponent', () => {
  let component: CategoryMainComponent;
  let fixture: ComponentFixture<CategoryMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryMainComponent]
    });
    fixture = TestBed.createComponent(CategoryMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
