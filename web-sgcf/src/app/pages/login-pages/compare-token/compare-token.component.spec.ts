import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import Swal from 'sweetalert2';
import { resetPassword } from '../../../service/auth.passwor-request';

import { CompareTokemComponent } from './compare-token.component';

describe('CompareTokemComponent', () => {
  let component: CompareTokemComponent;
  let fixture: ComponentFixture<CompareTokemComponent>;
  let service: jasmine.SpyObj<resetPassword>;

  beforeEach(async () => {
    service = jasmine.createSpyObj('resetPassword', ['compareTokem', 'changePassword']);
    service.compareTokem.and.returnValue(EMPTY);
    service.changePassword.and.returnValue(EMPTY);
    spyOn(Swal, 'fire');
    await TestBed.configureTestingModule({
      imports: [CompareTokemComponent],
      providers: [{ provide: resetPassword, useValue: service }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareTokemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  for (const [email, value] of [['', 'filled'], ['user@example.com', ''], ['   ', 'filled'], ['user@example.com', '   '], ['', '']]) {
    it(`blocks token comparison for ${JSON.stringify([email, value])}`, () => {
      component.email = email;
      component.token = value;
      component.compareToken();
      expect(Swal.fire).toHaveBeenCalled();
      expect(service.compareTokem).not.toHaveBeenCalled();
    });

    it(`blocks password change for ${JSON.stringify([email, value])}`, () => {
      component.email = email;
      component.newPassword = value;
      component.trocarSenha();
      expect(Swal.fire).toHaveBeenCalled();
      expect(service.changePassword).not.toHaveBeenCalled();
    });
  }

  it('submits a nonblank password exactly as entered', () => {
    component.email = 'user@example.com';
    component.newPassword = ' example ';
    component.trocarSenha();
    expect(service.changePassword).toHaveBeenCalledOnceWith({ email: component.email, password: ' example ' });
  });
});
