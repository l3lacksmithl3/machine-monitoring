import { MachineStatusComponent } from './page/machine-status/machine-status.component';


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './page/master/master.component';
import { MasterLosstimeComponent } from './page/master-losstime/master-losstime.component';
import { MachineStatusDetailComponent } from './page/machine-status-detail/machine-status-detail.component';

const routes: Routes = [
{
  path : 'MachineStatus',component: MachineStatusComponent
},
{
  path : 'Master',component: MasterComponent
},
{
  path : 'MachineStatusDetail',component: MachineStatusDetailComponent
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
