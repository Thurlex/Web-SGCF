import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareTokemComponent } from './compare-tokem.component';

describe('CompareTokemComponent', () => {
  let component: CompareTokemComponent;
  let fixture: ComponentFixture<CompareTokemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareTokemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareTokemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
