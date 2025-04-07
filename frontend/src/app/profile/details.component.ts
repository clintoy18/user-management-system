import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({ templateUrl: 'details.component.html' })
export class DetailsComponent implements OnInit {
    account: any; // Replace `any` with the correct type if known

    constructor(private accountService: AccountService) { }

    ngOnInit() {
        this.account = this.accountService.accountValue;
    }
}
    