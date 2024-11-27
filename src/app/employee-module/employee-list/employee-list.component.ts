import { Component, OnInit, ViewChild } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employeeService.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmationDialog } from '../../shared-component/custom-dialogbox/confirmation-dialog.component';
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent {

  // employee list will be assigned to this and it is passed as the data source to the mat-table in the HTML template 
  currentEmployeeList: any[] = [];
  previousEmployeeList: any[] = [];

  // dependency injection
  constructor(
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private router: Router,
    private snackBar:MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getEmployeeList();
  }

  onAddEmployee(): void {
    this.router.navigate(['/employee/add']);
  } 
  
  onEditEmployee(id: number) {
    this.router.navigate([`/employee/edit/${id}`]);
  }

  getEmployeeList() {
    this.employeeService.getAllEmployees().subscribe({
      next: (res:any) => {
        [this.currentEmployeeList, this.previousEmployeeList] = this.getCurrentAndPreviousEmployees(res, employee => (!employee?.endDate || new Date(employee?.endDate).getTime() > (new Date()).getTime()));
      },
      error: (err:any) => {
        console.log(err);
      },
    });
  }


  deleteEmployee(id: number) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: (res:any) => {
          this.snackBar.open('Record successfully deleted!', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
          this.getEmployeeList();
        },
        error: (err:any) => {
          console.log(err);
        },
      });
  }

  getCurrentAndPreviousEmployees(array, callback){
  let current: string[] = [], previous: string[] = [];
  array.forEach((e, idx, arr) => (callback(e, idx, arr) ? current : previous).push(e));
  return [current, previous];
  }

   openDialog(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialog,{
      data:{
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteEmployee(id);
      }
    });
  }
}
