import { Injectable } from '@angular/core';
import localforage from 'localforage';
import { Employee } from '../models/employee.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private readonly storeName = 'employees';

  constructor() { 
    // Set up LocalForage
    localforage.config({
      driver: localforage.INDEXEDDB, // Use IndexedDB
      name: 'employeeDB',
      storeName: this.storeName
    });
  }

  getAllEmployees(): Observable<Employee[]> {
    return new Observable((observer: any) => {
      localforage.getItem<Employee[]>(this.storeName).then((employees) => {
        observer.next(employees || []);
        observer.complete();
      });
    });
  }

  addEmployee(employee: Employee): Observable<boolean> {
    return new Observable((observer: any) => {
      this.getAllEmployees().subscribe((employees: any) => {
        employees.push(employee);
        localforage.setItem(this.storeName, employees).then(() => {
          observer.next(true);
          observer.complete();
        });
      });
    });
  }

  updateEmployee(updatedEmployee: Employee): Observable<boolean> {
    return new Observable((observer:any) => {
      this.getAllEmployees().subscribe((employees:any) => {
      const index = employees.findIndex((emp:any) => emp.id === updatedEmployee.id);
      if (index !== -1) {
        employees[index] = updatedEmployee;
        localforage.setItem(this.storeName, employees).then(() => {
          observer.next(true);
          observer.complete();
        });
      } else {
        observer.error('Employee not found');
      }
    });
  });
}

deleteEmployee(employeeId: number): Observable<boolean> {
  return new Observable((observer:any) => {
  this.getAllEmployees().subscribe((employees:any) => {
    const updatedEmployees = employees.filter((emp:any) => emp.id !== employeeId);
    localforage.setItem(this.storeName, updatedEmployees).then(() => {
      observer.next(true);
      observer.complete();
      });
    });
  });
 }
 
}
