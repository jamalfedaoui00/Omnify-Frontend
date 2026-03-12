import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Signin } from './pages/signin/signin';
import { Signup } from './pages/signup/signup';
import { ActivateAccount } from './pages/activate-account/activate-account';
import { StockAlerts } from './pages/stock-alerts/stock-alerts';
import { Users } from './pages/users/users';
import { WhatsappSetup } from './pages/whatsapp-setup/whatsapp-setup';
import { EmailSetup } from './pages/email-setup/email-setup';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: Signup },
  { path: 'signin', component: Signin },
  { path: 'activate-account', component: ActivateAccount },
  { path: 'stock-alerts', component: StockAlerts },
  { path: 'users', component: Users },
  { path: 'whatsapp-setup', component: WhatsappSetup },
  { path: 'email-setup', component: EmailSetup }
];