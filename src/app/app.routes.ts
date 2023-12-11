import { Routes } from '@angular/router';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { PrincipalComponent } from './components/principal/principal.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Travel Allowance',
    component: PrincipalComponent
  },
  {
    path: 'configuration',
    title: 'Configuration',
    component: ConfigurationComponent
  }
];
