import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '@app/_services/department.service';
import { Department } from '@app/_models/department';

@Component({
    templateUrl: 'list.component.html'
})
export class ListComponent implements OnInit {
    departments: Department[] = [];

    constructor(
        private departmentService: DepartmentService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadDepartments();
    }

    loadDepartments() {
        this.departmentService.getAll().subscribe(departments => this.departments = departments);
    }

    add() {
        this.router.navigate(['/admin/departments/add']);
    }

    edit(id: string) {
        this.router.navigate(['/admin/departments/edit', id]);
    }

    delete(id: string) {
        if (confirm('Are you sure you want to delete this department?')) {
            this.departmentService.delete(id).subscribe(() => this.loadDepartments());
        }
    }
} 