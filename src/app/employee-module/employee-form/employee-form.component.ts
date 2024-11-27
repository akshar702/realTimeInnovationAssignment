import { Component } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employeeService.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialog } from '../../shared-component/custom-dialogbox/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomDate } from '../../shared-component/custom-date/custom-date-header';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent {
  employeeForm: FormGroup;
  employeeList: any[] = [];
  editMode = false;
  currentEmployeeId: number | null = null;
  customDate = CustomDate;
  positions = ['Manager', 'Developer', 'Designer', 'Tester'];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar:MatSnackBar,
    private dialog: MatDialog
  ) {
    this.employeeForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      position: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isCurrentlyWorking: [false],
    });
  }

  ngOnInit(): void {
    // Check if we're editing an existing employee
      let paramId = this.route.snapshot.paramMap.get('id');
      if (paramId) {
        this.editMode = true;
        this.currentEmployeeId = +paramId;
        this.loadEmployeeDetails(this.currentEmployeeId);
      }

     // Listen for changes on the "Currently Working" checkbox
    this.employeeForm.get('isCurrentlyWorking')?.valueChanges.subscribe((isWorking: boolean) => {
      const endDateControl = this.employeeForm.get('endDate');
      isWorking ? endDateControl?.disable() : endDateControl?.enable();
    });
  }

  // Load employee details for editing
  loadEmployeeDetails(id: number): void {
    this.employeeService.getAllEmployees().subscribe((employees: any) => {
      this.employeeList = employees;
      const employee = this.employeeList.find((emp: any) => emp.id === id);
      if (employee) {
        this.employeeForm.patchValue(employee);
      }else{
        this.snackBar.open('Record not found!', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
        this.router.navigate(['/employees']); // Navigate back to the list
      }
    })
  }

  // Add or Update employee
  onSubmit(): void {
    if (this.employeeForm.invalid) return;

    const employeeData = this.employeeForm.value;
    if (this.editMode) {
      // Update employee
      this.employeeService.updateEmployee(employeeData).subscribe((res:any) => {
        this.snackBar.open('Record successfully updated!', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
        this.router.navigate(['/employees']); // Navigate back to the list
      }, (err) => {
        console.log(err, 'err');
      });;
    } else {
      // Add new employee
      this.employeeService.addEmployee({
        ...employeeData,
        id: this.generateUniqueId(),
      }).subscribe((res:any) => {
        this.snackBar.open('Record successfully created!', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
        this.router.navigate(['/employees']); // Navigate back to the list
      });
    }

  }

  // Generate a unique ID for each employee
  generateUniqueId(): number {
    return new Date().getTime();
  }

  openDialog() {
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
        this.deleteEmployee();
      }
    });
  }

deleteEmployee() {
      this.employeeService.deleteEmployee(Number(this.currentEmployeeId)).subscribe({
        next: (res:any) => {
          this.snackBar.open('Record successfully deleted!', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
          this.router.navigate(['/employees']);
        },
        error: (err:any) => {
          this.router.navigate(['/employees']);
          console.log(err);
        },
      });
  }

}