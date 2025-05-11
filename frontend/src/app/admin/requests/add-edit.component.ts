import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { RequestService } from '../../_services/request.service';
import { Request } from '../../_models/request';

@Component({
    templateUrl: 'add-edit.component.html'
})
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private requestService: RequestService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            description: ['', Validators.required]
        });

        if (!this.isAddMode) {
            this.requestService.getById(this.id)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createRequest();
        } else {
            this.updateRequest();
        }
    }

    private createRequest() {
        this.requestService.create(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    console.error('Error creating request:', error);
                    this.loading = false;
                }
            });
    }

    private updateRequest() {
        this.requestService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    console.error('Error updating request:', error);
                    this.loading = false;
                }
            });
    }
}
