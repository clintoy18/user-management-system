import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '@app/_services/employee.services';
import { Employee } from '@app/_models/employee';

@Component({
    templateUrl: 'list.component.html'
})
export class ListComponent implements OnInit {
    employees: Employee[] = [];

    constructor(
        private employeeService: EmployeeService,
        private router: Router
    ) { }

    ngOnInit() {
        this.employeeService.getAll().subscribe(employees => this.employees = employees);
    }

    add() {
        this.router.navigate(['/admin/employees/add']);
    }

    edit(id: string) {
        this.router.navigate(['edit', id], { relativeTo: this.router.routerState.root.firstChild });
    }

    viewRequests(id: string) {
        this.router.navigate(['/admin/requests'], { queryParams: { employeeId: id } });
    }

    viewWorkflows(id: string) {
        this.router.navigate(['/admin/workflows'], { queryParams: { employeeId: id } });
    }

    transfer(id: string) {
        this.router.navigate(['/admin/employees/transfer', id]);
    }
} 