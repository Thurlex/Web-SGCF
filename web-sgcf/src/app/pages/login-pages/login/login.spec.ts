import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { Login } from './login';

it('opens password recovery through the router without a page reload', () => {
  TestBed.configureTestingModule({ imports: [Login], providers: [provideHttpClient(), provideRouter([])] });
  const router = TestBed.inject(Router);
  const navigate = spyOn(router, 'navigateByUrl').and.resolveTo(true);
  const fixture = TestBed.createComponent(Login);
  fixture.detectChanges();
  const link = fixture.nativeElement.querySelector('a[href$="reset-password"]') as HTMLAnchorElement;
  const click = new MouseEvent('click', { button: 0, cancelable: true });

  link.addEventListener('click', event => {
    expect(event.defaultPrevented).toBeTrue();
    event.preventDefault();
  }, { once: true });
  link.dispatchEvent(click);
  expect(navigate.calls.count()).toBe(1);
  expect(navigate.calls.mostRecent()?.args[0]?.toString()).toBe('/reset-password');
});

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
