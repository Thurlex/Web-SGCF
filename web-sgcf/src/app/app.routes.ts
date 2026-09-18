import { Routes } from '@angular/router';

import { Customers } from './pages/customers/customers';
import { Dashboard } from './pages/dashboard/dashboard';
import { Employees } from './pages/employees/employees';
import { Quotas } from './pages/quotas/quotas';
import { Reservations } from './pages/reservations/reservations';
import { Tours } from './pages/tours/tours';
import { Users } from './pages/user/user';
import { Logs } from './pages/logs/logs';

import { Login } from './pages/login-pages/login/login';
import { Layout } from './layout/layout';
import { authGuard } from './service/auth.guard';
import { managerGuard } from './service/manager.guard';
import { ResetPasswordComponent } from './pages/login-pages/reset-password/reset-password.component';
import { CompareTokemComponent } from './pages/login-pages/compare-tokem/compare-tokem.component';

export const routes: Routes = [
  {
  path: 'login',
  component: Login,
  title: 'Login | SGCF'
},
{
  path: 'reset-password',
  component: ResetPasswordComponent,
  title: 'Recuperar senha | SGCF'
},
{
  path: 'compare-tokem',
  component: CompareTokemComponent,
  title: 'Recuperar senha | SGCF'
},
 {
  path: '',
  component: Layout,
  canActivate: [authGuard],
  children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'dashboard'
    },

    {
      path: 'dashboard',
      component: Dashboard,
      title: 'Painel | SGCF'
    },

    {
      path: 'clientes',
      component: Customers,
      title: 'Clientes | SGCF'
    },

    {
      path: 'funcionarios',
      component: Employees,
      canActivate: [managerGuard],
      title: 'Funcionários | SGCF'
    },

    {
      path: 'metas',
      component: Quotas,
      title: 'Metas | SGCF'
    },

    {
      path: 'reservas',
      component: Reservations,
      title: 'Reservas | SGCF'
    },

    {
      path: 'tours',
      component: Tours,
      title: 'Tours | SGCF'
    },

    {
      path: 'usuario',
      component: Users,
      title: 'Usuário | SGCF'
    },

    {
      path: 'logs',
      component: Logs,
      canActivate: [managerGuard],//apenas o gerente pode acessar os logs(tem que definir isso aiinda)
      title: 'Logs do sistema | SGCF'
    }
  ]
}
];
