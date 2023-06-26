import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrFilterButtonComponent } from './pr-filter-button.component';

describe('PrFilterButtonComponent', () => {
  let component: PrFilterButtonComponent;
  let fixture: ComponentFixture<PrFilterButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrFilterButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrFilterButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
