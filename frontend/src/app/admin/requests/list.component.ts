import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { RequestService } from '@app/_services/request.service';    
import { Request } from '@app/_models/request';
import { AlertService } from '@app/_services';

@Component({
    templateUrl: 'list.component.html'
})
export class ListComponent implements OnInit {
    requests: any[] = [];

    constructor(
        private requestService: RequestService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.loadRequests();
    }

    loadRequests() {
        this.requestService.getAll().subscribe(requests => {
            this.requests = requests.map(request => ({
                ...request,
                isApproving: false,
                isRejecting: false,
                isDeleting: false
            }));
        });
    }

    deleteRequest(id: string) {
        const request = this.requests.find(x => x.id === id);
        request.isDeleting = true;
        this.requestService.delete(id)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.requests = this.requests.filter(x => x.id !== id);
                    this.alertService.success('Request deleted successfully');
                },
                error: error => {
                    console.error('Error deleting request:', error);
                    this.alertService.error(error.error.message || 'Error deleting request');
                    request.isDeleting = false;
                }
            });
    }

    approveRequest(id: string) {
        const request = this.requests.find(x => x.id === id);
        if (request) {
            request.isApproving = true;
            this.requestService.approveRequest(id)
                .pipe(first())
                .subscribe({
                    next: () => {
                        request.status = 'approved';
                        request.isApproving = false;
                        this.alertService.success('Request approved successfully');
                    },
                    error: (error) => {
                        console.error('Error approving request:', error);
                        this.alertService.error(error.error.message || 'Error approving request');
                        request.isApproving = false;
                    }
                });
        }
    }

    rejectRequest(id: string) {
        const request = this.requests.find(x => x.id === id);
        if (request) {
            request.isRejecting = true;
            this.requestService.rejectRequest(id)
                .pipe(first())
                .subscribe({
                    next: () => {
                        request.status = 'rejected';
                        request.isRejecting = false;
                        this.alertService.success('Request rejected successfully');
                    },
                    error: (error) => {
                        console.error('Error rejecting request:', error);
                        this.alertService.error(error.error.message || 'Error rejecting request');
                        request.isRejecting = false;
                    }
                });
        }
    }
}
