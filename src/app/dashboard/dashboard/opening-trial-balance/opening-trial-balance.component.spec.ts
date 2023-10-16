import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningTrialBalanceComponent } from './opening-trial-balance.component';

describe('OpeningTrialBalanceComponent', () => {
  let component: OpeningTrialBalanceComponent;
  let fixture: ComponentFixture<OpeningTrialBalanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpeningTrialBalanceComponent]
    });
    fixture = TestBed.createComponent(OpeningTrialBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
