import DefaultLayout from '../components/DashboardLayout.vue'
import Account from '../views/account/Account.vue'
import Dashboard from '../views/Dashboard.vue'
import Expenses from '../views/expenses/Expenses.vue'
import Incomes from '../views/incomes/Incomes.vue'
import Login from '../views/auth/Login.vue'

export default [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    redirect: '/dashboard',
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: '/expenses',
        name: 'Expenses',
        component: Expenses,
      },
      {
        path: '/incomes',
        name: 'Incomes',
        component: Incomes,
      },
      {
        path: '/account',
        name: 'Account',
        component: Account,
      },
    ],
  },
]
