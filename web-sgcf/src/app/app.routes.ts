import { Routes } from '@angular/router';

import { Customers } from './pages/customers/customers';
import { Dashboard } from './pages/dashboard/dashboard';
import { EditReservation } from './pages/edit-reservation/edit-reservation';
import { EditReservationStatus } from './pages/edit-reservation-status/edit-reservation-status';
import { Employees } from './pages/employees/employees';
import { Quotas } from './pages/quotas/quotas';
import { Reservations } from './pages/reservations/reservations';
import { Tours } from './pages/tours/tours';
import { User } from './pages/user/user';

import { Login } from './pages/login/login';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
  path: 'login',
  component: Login,
  title: 'Login | SGCF'
},
{
      path: '',
      pathMatch: 'full',
      redirectTo: 'login'
    },
 {
  path: '',
  component: Layout,
  children: [

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
      path: 'reservas/editar',
      component: EditReservation,
      title: 'Editar reserva | SGCF'
    },

    {
      path: 'reservas/editar-status',
      component: EditReservationStatus,
      title: 'Editar status da reserva | SGCF'
    },

    {
      path: 'tours',
      component: Tours,
      title: 'Tours | SGCF'
    },

    {
      path: 'usuario',
      component: User,
      title: 'Usuário | SGCF'
    }
  ]
}
];
