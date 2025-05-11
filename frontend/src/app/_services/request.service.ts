import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environment } from '@environments/environment';
import { Request } from '@app/_models/request';

@Injectable({ providedIn: 'root' })
export class RequestService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Request[]>(`${environment.apiUrl}/requests`);
    }

    getById(id: string) {
        return this.http.get<Request>(`${environment.apiUrl}/requests/${id}`);
    }

    create(request: Request) {
        return this.http.post(`${environment.apiUrl}/requests`, request);
    }

    update(id: string, request: Request) {
        return this.http.put(`${environment.apiUrl}/requests/${id}`, request);
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/requests/${id}`);
    }

    approveRequest(id: string) {
        return this.http.put(`${environment.apiUrl}/requests/${id}/approve`, {});
    }

    rejectRequest(id: string) {
        return this.http.put(`${environment.apiUrl}/requests/${id}/reject`, {});
    }
} 