import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HisaabComponent } from './hisaab.component';

describe('HisaabComponent', () => {
  let component: HisaabComponent;
  let fixture: ComponentFixture<HisaabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HisaabComponent]
    });
    fixture = TestBed.createComponent(HisaabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
