import { MachineStatusComponent } from './page/machine-status/machine-status.component';


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './page/master/master.component';

const routes: Routes = [
{
  path : 'MachineStatus',component: MachineStatusComponent
},
{
  path : 'Master',component: MasterComponent
},




{
  path: '**',
  redirectTo: 'MachineStatus'
  // redirectTo: 'dashboard'
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
