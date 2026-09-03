/*import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

interface MockUser {
  id: number;
  userName: string;
  permission: string;
  email: string;
  employeeId: number | null;
  password: string;
}

interface MockCustomer {
  id: number;
  cnpj: string;
  cpf: string;
  name: string;
  languageSpeak: string[];
  countryCustomer: string;
  email: string;
}

interface MockEmployee {
  id: number;
  cpf: string;
  name: string;
  languagesSpoken: string[];
  dayOfBirth: string;
  active: boolean;
}

interface MockTour {
  id: number;
  price: number;
  countryTour: string;
  kmOftour: number;
  nameOfTour: string;
  locations: string;
}

interface MockReservation {
  id: number;
  date: string;
  tourId: number;
  customerId: number;
  employeeId: number;
  value: number;
  status: string;
}

interface MockQuota {
  id: number;
  startDate: string;
  endDate: string;
  targetValue: number;
  employeeId: number | null;
}

const users: MockUser[] = [
  {
    id: 1,
    userName: 'ana.moraes',
    permission: 'Manager',
    email: 'gerente@sgcf.com',
    employeeId: 1,
    password: '123456',
  },
  {
    id: 2,
    userName: 'carlos.lima',
    permission: 'Employee',
    email: 'funcionario@sgcf.com',
    employeeId: 2,
    password: '123456',
  },
];

let customers: MockCustomer[] = [
  {
    id: 1,
    cnpj: '',
    cpf: '55566677788',
    name: 'Fernanda Alves',
    languageSpeak: ['Portuguese'],
    countryCustomer: 'Brazil',
    email: 'fernanda.alves@email.com',
  },
  {
    id: 2,
    cnpj: '',
    cpf: '66677788899',
    name: 'John Miller',
    languageSpeak: ['English'],
    countryCustomer: 'United_states',
    email: 'john.miller@email.com',
  },
  {
    id: 3,
    cnpj: '12345678000190',
    cpf: '',
    name: 'Agência Vale Turismo',
    languageSpeak: ['Portuguese', 'Spanish'],
    countryCustomer: 'Brazil',
    email: 'contato@valeturismo.com.br',
  },
  {
    id: 4,
    cnpj: '',
    cpf: '77788899900',
    name: 'Lucía Fernández',
    languageSpeak: ['Spanish'],
    countryCustomer: 'Paraguay',
    email: 'lucia.fernandez@email.com',
  },
  {
    id: 5,
    cnpj: '',
    cpf: '88899900011',
    name: 'Klaus Meyer',
    languageSpeak: ['English'],
    countryCustomer: 'Europe',
    email: 'klaus.meyer@email.com',
  },
];

let employees: MockEmployee[] = [
  {
    id: 1,
    cpf: '11122233344',
    name: 'Ana Beatriz Moraes',
    languagesSpoken: ['Portuguese', 'Spanish'],
    dayOfBirth: '1995-04-12',
    active: true,
  },
  {
    id: 2,
    cpf: '22233344455',
    name: 'Carlos Eduardo Lima',
    languagesSpoken: ['Portuguese', 'English'],
    dayOfBirth: '1990-09-30',
    active: true,
  },
  {
    id: 3,
    cpf: '33344455566',
    name: 'Mariana Souza',
    languagesSpoken: ['Portuguese', 'Spanish', 'English'],
    dayOfBirth: '1998-01-25',
    active: true,
  },
  {
    id: 4,
    cpf: '44455566677',
    name: 'Rafael Nogueira',
    languagesSpoken: ['Portuguese'],
    dayOfBirth: '1988-07-08',
    active: true,
  },
];

let tours: MockTour[] = [
  {
    id: 1,
    price: 320,
    countryTour: 'Brazil',
    kmOftour: 25,
    nameOfTour: 'Cataratas do Iguaçu',
    locations: 'Parque Nacional do Iguaçu, Trilha das Cataratas',
  },
  {
    id: 2,
    price: 180,
    countryTour: 'Brazil',
    kmOftour: 12,
    nameOfTour: 'Parque das Aves',
    locations: 'Viveiro das Araras, Borboletário, Serpentário',
  },
  {
    id: 3,
    price: 450,
    countryTour: 'Argentina',
    kmOftour: 40,
    nameOfTour: 'Cataratas Argentinas',
    locations: 'Puerto Iguazú, Garganta del Diablo, Circuito Superior',
  },
  {
    id: 4,
    price: 150,
    countryTour: 'Paraguay',
    kmOftour: 18,
    nameOfTour: 'Compras em Ciudad del Este',
    locations: 'Ponte da Amizade, Shopping del Este, Mercado 4',
  },
  {
    id: 5,
    price: 210,
    countryTour: 'Brazil',
    kmOftour: 20,
    nameOfTour: 'Itaipu Binacional',
    locations: 'Barragem de Itaipu, Mirante Central, Ecomuseu',
  },
];

let reservations: MockReservation[] = [
  { id: 1, date: dayOfMonth(3), tourId: 1, customerId: 1, employeeId: 1, value: 640, status: 'Confirmed' },
  { id: 2, date: dayOfMonth(5), tourId: 3, customerId: 2, employeeId: 2, value: 900, status: 'Confirmed' },
  { id: 3, date: dayOfMonth(7), tourId: 2, customerId: 3, employeeId: 1, value: 720, status: 'Pending' },
  { id: 4, date: dayOfMonth(10), tourId: 4, customerId: 4, employeeId: 3, value: 300, status: 'Confirmed' },
  { id: 5, date: dayOfMonth(12), tourId: 5, customerId: 5, employeeId: 2, value: 420, status: 'Cancelled' },
  { id: 6, date: dayOfMonth(15), tourId: 1, customerId: 3, employeeId: 3, value: 1600, status: 'Confirmed' },
  { id: 7, date: dayOfMonth(18), tourId: 3, customerId: 1, employeeId: 4, value: 450, status: 'Pending' },
  { id: 8, date: dayOfMonth(20), tourId: 5, customerId: 2, employeeId: 1, value: 210, status: 'Confirmed' },
];

let quotas: MockQuota[] = [
  { id: 1, startDate: dayOfMonth(1), endDate: lastDayOfMonth(), targetValue: 20000, employeeId: null },
  { id: 2, startDate: dayOfMonth(1), endDate: lastDayOfMonth(), targetValue: 3000, employeeId: 1 },
  { id: 3, startDate: dayOfMonth(1), endDate: lastDayOfMonth(), targetValue: 2500, employeeId: 2 },
  { id: 4, startDate: dayOfMonth(1), endDate: lastDayOfMonth(), targetValue: 4000, employeeId: 3 },
];

const sessionKey = 'sgcf-mock-session';

export const mockApiInterceptor: HttpInterceptorFn = (request, next) => {
  const url = request.url.toLowerCase();

  if (!url.startsWith('/api/')) {
    return next(request);
  }

  const route = `${request.method.toLowerCase()} ${url.replace('/api/', '')}`;
  const id = Number(url.substring(url.lastIndexOf('/') + 1));
  const body = request.body as Record<string, any> | null;

  if (route === 'post user/authenticate') {
    const user = users.find(
      (item) => item.email === body?.['email'] && item.password === body?.['password'],
    );

    if (!user) {
      return fail(401, 'Usuário ou senha incorretos.');
    }

    localStorage.setItem(sessionKey, String(user.id));
    return ok(sessionUser(user));
  }

  if (route === 'get user/session') {
    const user = currentUser();
    return user ? ok(sessionUser(user)) : fail(401, 'Sessão não encontrada.');
  }

  if (route === 'post user/logout') {
    localStorage.removeItem(sessionKey);
    return ok(null);
  }

  if (route === 'get customer/findall' || route === 'get customer/findall/active') {
    return ok(customers);
  }

  if (route === 'post customer/save') {
    customers = [...customers, { ...(body as MockCustomer), id: nextId(customers) }];
    return ok('Cliente cadastrado com sucesso.');
  }

  if (route.startsWith('post customer/update/')) {
    customers = customers.map((customer) =>
      customer.id === id ? { ...customer, ...(body as MockCustomer), id } : customer,
    );
    return ok('Cliente atualizado com sucesso.');
  }

  if (route.startsWith('delete customer/delete/')) {
    customers = customers.filter((customer) => customer.id !== id);
    reservations = reservations.filter((reservation) => reservation.customerId !== id);
    return ok('Cliente removido com sucesso.');
  }

  if (route === 'get employee/findall' || route === 'get employee/findall/active') {
    return ok(employees.map(employeeDto));
  }

  if (route === 'post employee/save') {
    employees = [...employees, { ...(body as MockEmployee), id: nextId(employees), active: true }];
    return ok('Funcionário cadastrado com sucesso.');
  }

  if (route.startsWith('post employee/update/')) {
    employees = employees.map((employee) =>
      employee.id === id ? { ...employee, ...(body as MockEmployee), id } : employee,
    );
    return ok('Funcionário atualizado com sucesso.');
  }

  if (route.startsWith('delete employee/deactivate/')) {
    const user = users.find(
      (item) => item.email === body?.['email'] && item.password === body?.['password'],
    );

    if (!user) {
      return fail(401, 'As credenciais informadas não são válidas.');
    }

    employees = employees.map((employee) =>
      employee.id === id ? { ...employee, active: false } : employee,
    );
    return ok('Funcionário desativado com sucesso.');
  }

  if (route.startsWith('delete employee/delete/')) {
    employees = employees.filter((employee) => employee.id !== id);
    return ok('Funcionário removido com sucesso.');
  }

  if (route === 'get tour/findall' || route === 'get tour/findall/active') {
    return ok(tours.map(tourDto));
  }

  if (route === 'post tour/save') {
    tours = [...tours, { ...(body as MockTour), id: nextId(tours) }];
    return ok('Tour cadastrado com sucesso.');
  }

  if (route.startsWith('post tour/update/')) {
    tours = tours.map((tour) => (tour.id === id ? { ...tour, ...(body as MockTour), id } : tour));
    return ok('Tour atualizado com sucesso.');
  }

  if (route.startsWith('delete tour/delete/')) {
    tours = tours.filter((tour) => tour.id !== id);
    reservations = reservations.filter((reservation) => reservation.tourId !== id);
    return ok('Tour removido com sucesso.');
  }

  if (route === 'get reservation/findall' || route === 'get reservation/findall/active') {
    return ok(reservations.map(reservationDto));
  }

  if (route.startsWith('get reservation/findid/')) {
    const reservation = reservations.find((item) => item.id === id);
    return reservation ? ok(reservationDto(reservation)) : fail(404, 'Reserva não encontrada.');
  }

  if (route === 'post reservation/save') {
    reservations = [...reservations, { ...(body as MockReservation), id: nextId(reservations) }];
    return ok('Reserva cadastrada com sucesso.');
  }

  if (route.startsWith('post reservation/update/')) {
    reservations = reservations.map((reservation) =>
      reservation.id === id ? { ...reservation, ...(body as MockReservation), id } : reservation,
    );
    return ok('Reserva atualizada com sucesso.');
  }

  if (route.startsWith('patch reservation/updatepatch/')) {
    reservations = reservations.map((reservation) =>
      reservation.id === id ? { ...reservation, ...body } : reservation,
    );
    return ok('Reserva atualizada com sucesso.');
  }

  if (route.startsWith('delete reservation/delete/')) {
    reservations = reservations.filter((reservation) => reservation.id !== id);
    return ok('Reserva removida com sucesso.');
  }

  if (route.startsWith('get quota/findall')) {
    return ok(quotas.map(quotaDto));
  }

  if (route === 'post quota/save') {
    quotas = [
      ...quotas,
      {
        id: nextId(quotas),
        startDate: body?.['startDate'] ?? dayOfMonth(1),
        endDate: lastDayOfMonth(),
        targetValue: body?.['targetValue'] ?? 0,
        employeeId: body?.['employeeId'] ?? null,
      },
    ];
    return ok('Meta cadastrada com sucesso.');
  }

  if (route.startsWith('patch quota/updatepatch/')) {
    quotas = quotas.map((quota) => (quota.id === id ? { ...quota, ...body } : quota));
    return ok('Meta atualizada com sucesso.');
  }

  if (route.startsWith('delete quota/delete/')) {
    quotas = quotas.filter((quota) => quota.id !== id);
    return ok('Meta removida com sucesso.');
  }

  return fail(404, 'Recurso não encontrado no mock.');
};

function currentUser(): MockUser | undefined {
  const stored = localStorage.getItem(sessionKey);
  return users.find((user) => String(user.id) === stored);
}

function sessionUser(user: MockUser) {
  return {
    id: user.id,
    userName: user.userName,
    permission: user.permission,
    email: user.email,
    employeeId: user.employeeId,
  };
}

function employeeDto(employee: MockEmployee) {
  const done = reservations.filter(
    (reservation) => reservation.employeeId === employee.id && reservation.status === 'Confirmed',
  );

  return {
    ...employee,
    tourAmount: done.length,
    cashReturn: done.reduce((total, reservation) => total + reservation.value, 0),
  };
}

function tourDto(tour: MockTour) {
  return {
    ...tour,
    reservationCount: reservations.filter((reservation) => reservation.tourId === tour.id).length,
  };
}

function reservationDto(reservation: MockReservation) {
  const employee = employees.find((item) => item.id === reservation.employeeId);

  return {
    id: reservation.id,
    date: reservation.date,
    tour: tours.find((item) => item.id === reservation.tourId) ?? null,
    customer: customers.find((item) => item.id === reservation.customerId) ?? null,
    employee: employee ? employeeDto(employee) : null,
    value: reservation.value,
    status: reservation.status,
  };
}

function quotaDto(quota: MockQuota) {
  const employee = employees.find((item) => item.id === quota.employeeId);
  const achievedValue = reservations
    .filter((reservation) => reservation.status === 'Confirmed')
    .filter((reservation) => reservation.date >= quota.startDate && reservation.date <= quota.endDate)
    .filter((reservation) => quota.employeeId === null || reservation.employeeId === quota.employeeId)
    .reduce((total, reservation) => total + reservation.value, 0);

  return {
    id: quota.id,
    startDate: quota.startDate,
    endDate: quota.endDate,
    targetValue: quota.targetValue,
    achievedValue,
    employee: employee ? employeeDto(employee) : null,
  };
}

function nextId(list: { id: number }[]): number {
  return list.reduce((greater, item) => Math.max(greater, item.id), 0) + 1;
}

function dayOfMonth(day: number): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');

  return `${today.getFullYear()}-${month}-${String(day).padStart(2, '0')}`;
}

function lastDayOfMonth(): string {
  const today = new Date();

  return dayOfMonth(new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate());
}

function ok(body: unknown): Observable<HttpResponse<unknown>> {
  return of(new HttpResponse({ status: 200, body })).pipe(delay(250));
}

function fail(status: number, message: string): Observable<never> {
  return throwError(() => new HttpErrorResponse({ status, error: message }));
}*/
