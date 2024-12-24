import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitTypeComponent } from './unit-type.component';

describe('UnitTypeComponent', () => {
  let component: UnitTypeComponent;
  let fixture: ComponentFixture<UnitTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnitTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
