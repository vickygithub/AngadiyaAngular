import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnlComponent } from './pnl.component';

describe('PnlComponent', () => {
  let component: PnlComponent;
  let fixture: ComponentFixture<PnlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PnlComponent]
    });
    fixture = TestBed.createComponent(PnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
