import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EmployeeModuleRoutingModule } from './employee-module-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { MaterialModule } from '../shared-module/material.module';
import { CustomDate } from '../shared-component/custom-date/custom-date-header';


@NgModule({
  declarations: [
    CustomDate,
    EmployeeListComponent,
    EmployeeFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    EmployeeModuleRoutingModule
  ]
})
export class EmployeeModule { }
