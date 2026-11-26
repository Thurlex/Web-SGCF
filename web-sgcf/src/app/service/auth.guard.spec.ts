import { HttpErrorResponse, HttpResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { authGuard } from './auth.guard';
import { managerGuard } from './manager.guard';
import { AuthenticatedUser } from './auth.service';

@Component({ template: '' })
class TestPage {}

describe('Session guards', () => {
  let user: AuthenticatedUser | null;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    user = { id: 1, userName: 'employee', permission: 'EMPLOYEE', email: 'employee@example.com', employeeId: 2 };
    TestBed.configureTestingModule({ providers: [
      provideRouter([
        { path: 'dashboard', component: TestPage, canActivate: [authGuard] },
        { path: 'admin', component: TestPage, canActivate: [managerGuard] },
        { path: 'login', component: TestPage },
      ]),
      provideHttpClient(withInterceptors([(req) => {
        if (req.method === 'GET' && req.url === '/api/user/me' && user) {
          return of(new HttpResponse({ body: user }));
        }
        return throwError(() => new HttpErrorResponse({ status: 401 }));
      }])),
    ] });
    harness = await RouterTestingHarness.create();
  });

  it('lets an employee open the dashboard', async () => {
    await harness.navigateByUrl('/dashboard');
    expect(TestBed.inject(Router).url).toBe('/dashboard');
  });

  it('redirects an employee from a manager route to the dashboard, not to login', async () => {
    await harness.navigateByUrl('/admin');
    expect(TestBed.inject(Router).url).toBe('/dashboard');
  });

  it('allows a manager on a manager route', async () => {
    user = { ...user!, permission: 'MANAGER' };
    await harness.navigateByUrl('/admin');
    expect(TestBed.inject(Router).url).toBe('/admin');
  });

  it('redirects to login when the server rejects the session', async () => {
    user = null;
    await harness.navigateByUrl('/dashboard');
    expect(TestBed.inject(Router).url).toBe('/login');
  });
});
