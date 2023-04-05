import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrAddComponent } from './pr-add.component';

describe('PrAddComponent', () => {
  let component: PrAddComponent;
  let fixture: ComponentFixture<PrAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
