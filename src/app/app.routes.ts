import { Routes } from '@angular/router';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { PrincipalComponent } from './components/principal/principal.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Viático',
    component: PrincipalComponent
  },
  {
    path: 'configuration',
    title: 'Configuración',
    component: ConfigurationComponent
  }
];
