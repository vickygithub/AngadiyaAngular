import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngadiyaListComponent } from './angadiya-list.component';

describe('AngadiyaListComponent', () => {
  let component: AngadiyaListComponent;
  let fixture: ComponentFixture<AngadiyaListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AngadiyaListComponent]
    });
    fixture = TestBed.createComponent(AngadiyaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
