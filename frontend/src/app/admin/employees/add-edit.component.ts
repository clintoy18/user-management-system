import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '@app/_services/employee.service';
import { Employee } from '@app/_models/employee';
import { AccountService } from '@app/_services/account.service';
import { Account } from '@app/_models/account';

@Component({
    templateUrl: 'add-edit.component.html'
})
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    accounts: Account[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private employeeService: EmployeeService,
        private accountService: AccountService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            employeeId: ['', Validators.required],
            account: ['', Validators.required],
            position: ['', Validators.required],
            department: ['', Validators.required],
            hireDate: ['', Validators.required],
            status: ['', Validators.required]
        });

        this.accountService.getAll().subscribe(accounts => this.accounts = accounts);

        if (!this.isAddMode) {
            this.employeeService.getById(this.id)
                .subscribe(x => this.form.patchValue(x));
        }
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
        if (this.isAddMode) {
            this.createEmployee();
        } else {
            this.updateEmployee();
        }
    }

    private createEmployee() {
        this.employeeService.create(this.form.value)
            .subscribe({
                next: () => {
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.loading = false;
                }
            });
    }

    private updateEmployee() {
        this.employeeService.update(this.id, this.form.value)
            .subscribe({
                next: () => {
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.loading = false;
                }
            });
    }
} 