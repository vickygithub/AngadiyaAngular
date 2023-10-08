import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosingBalanceSummaryComponent } from './closing-balance-summary.component';

describe('ClosingBalanceSummaryComponent', () => {
  let component: ClosingBalanceSummaryComponent;
  let fixture: ComponentFixture<ClosingBalanceSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClosingBalanceSummaryComponent]
    });
    fixture = TestBed.createComponent(ClosingBalanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
