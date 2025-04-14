import { Component, OnInit } from '@angular/core'; 
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services'; 
import { Account } from '@app/_models';
@Component({ templateUrl: 'list.component.html' }) 
export class ListComponent implements OnInit { 
    accounts: any [];

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(accounts => this.accounts = accounts);
    }

    deleteAccount (id: string) {
        const account = this.accounts.find(x => x.id === id); 
        account.isDeleting = true; 
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.accounts = this.accounts.filter(x => x.id !== id)
            });
    }

    deactivateAccount(id: number) {
        const account = this.accounts.find(x => x.id === id);
        if (account) {
            account.isDeactivating = true;
            this.accountService.deactivateAccount(id).subscribe({
                next: () => {
                    account.isActive = false; // Update the account state
                    account.isDeactivating = false; // Reset the deactivating flag
                },
                error: (err) => {
                    console.error('Error deactivating account:', err);
                    account.isDeactivating = false; // Reset the flag on error
                }
            });
        }
    }

    activateAccount(id: number) {
        const account = this.accounts.find(x => x.id === id);
        if (account) {
            account.isActivating = true;
            this.accountService.activateAccount(id).subscribe({
                next: () => {
                    account.isActive = true; // Update the account state
                    account.isActivating = false; // Reset the activating flag
                },
                error: (err) => {
                    console.error('Error activating account:', err);
                    account.isActivating = false; // Reset the flag on error
                }
            });
        }
    }
}