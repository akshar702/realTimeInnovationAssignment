import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-module/employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-module/employee-form/employee-form.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./employee-module/employee-module.module').then(m => m.EmployeeModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
