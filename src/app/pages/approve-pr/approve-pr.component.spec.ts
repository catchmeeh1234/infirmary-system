import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePrComponent } from './approve-pr.component';

describe('ApprovePrComponent', () => {
  let component: ApprovePrComponent;
  let fixture: ComponentFixture<ApprovePrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovePrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovePrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
