import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalTransactionComponent } from './journal-transaction.component';

describe('JournalTransactionComponent', () => {
  let component: JournalTransactionComponent;
  let fixture: ComponentFixture<JournalTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JournalTransactionComponent]
    });
    fixture = TestBed.createComponent(JournalTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
