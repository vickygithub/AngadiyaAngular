import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashTransactionListComponent } from './cash-transaction-list.component';

describe('CashTransactionListComponent', () => {
  let component: CashTransactionListComponent;
  let fixture: ComponentFixture<CashTransactionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CashTransactionListComponent]
    });
    fixture = TestBed.createComponent(CashTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
