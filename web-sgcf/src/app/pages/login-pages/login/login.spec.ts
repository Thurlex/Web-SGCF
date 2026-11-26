import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { Login } from './login';

describe('Login JWT', () => {
  let login: Login;
  let router: jasmine.SpyObj<Router>;
  let http: HttpTestingController;
  let store: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    router = jasmine.createSpyObj('Router', ['navigate']);
    login = new Login(TestBed.inject(AuthService), router);
    store = spyOn(Storage.prototype, 'setItem');
  });

  afterEach(() => http.verify());

  it('stores the bearer token before opening the dashboard without a credentialed request', () => {
    login.login();
    const req = http.expectOne('/api/user/authenticate');
    expect(req.request.withCredentials).toBeFalse();
    req.flush({ success: true, token: 'test-token' });
    expect(store).toHaveBeenCalledWith('access_token', 'test-token');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('rejects a successful HTTP response without a token', () => {
    login.login();
    http.expectOne('/api/user/authenticate').flush({ success: true });
    expect(store).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
