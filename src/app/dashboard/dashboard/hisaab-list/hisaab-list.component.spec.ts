import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HisaabListComponent } from './hisaab-list.component';

describe('HisaabListComponent', () => {
  let component: HisaabListComponent;
  let fixture: ComponentFixture<HisaabListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HisaabListComponent]
    });
    fixture = TestBed.createComponent(HisaabListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
