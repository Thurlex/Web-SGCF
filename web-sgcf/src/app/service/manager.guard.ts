import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

export const managerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.session().pipe(
    map((user) => user.permission === 'Manager'
      ? true
      : router.createUrlTree(['/dashboard'])),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};
