import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrHistoryComponent } from './pr-history.component';

describe('PrHistoryComponent', () => {
  let component: PrHistoryComponent;
  let fixture: ComponentFixture<PrHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
