import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoEncontroComponent } from './no-encontro.component';

describe('NoEncontroComponent', () => {
  let component: NoEncontroComponent;
  let fixture: ComponentFixture<NoEncontroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoEncontroComponent]
    });
    fixture = TestBed.createComponent(NoEncontroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
