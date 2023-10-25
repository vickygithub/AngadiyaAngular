import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossListComponent } from './loss-list.component';

describe('LossListComponent', () => {
  let component: LossListComponent;
  let fixture: ComponentFixture<LossListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LossListComponent]
    });
    fixture = TestBed.createComponent(LossListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
