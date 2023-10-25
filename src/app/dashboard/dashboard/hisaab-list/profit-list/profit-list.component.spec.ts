import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitListComponent } from './profit-list.component';

describe('ProfitListComponent', () => {
  let component: ProfitListComponent;
  let fixture: ComponentFixture<ProfitListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfitListComponent]
    });
    fixture = TestBed.createComponent(ProfitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
