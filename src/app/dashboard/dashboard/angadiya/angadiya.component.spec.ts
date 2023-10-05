import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngadiyaComponent } from './angadiya.component';

describe('AngadiyaComponent', () => {
  let component: AngadiyaComponent;
  let fixture: ComponentFixture<AngadiyaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AngadiyaComponent]
    });
    fixture = TestBed.createComponent(AngadiyaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
