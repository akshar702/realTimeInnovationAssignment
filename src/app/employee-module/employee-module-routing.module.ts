import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/employees', pathMatch: 'full' }, // Default route to the employee list
  { path: 'employees', component: EmployeeListComponent },   // Route to the employee list
  { path: 'employee/edit/:id', component: EmployeeFormComponent },  // Route to edit an employee
  { path: 'employee/add', component: EmployeeFormComponent }, // Route to add a new employee
  { path: '**', redirectTo: '/employees', pathMatch: 'full' }, // Route to add a new employee
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeModuleRoutingModule { }
