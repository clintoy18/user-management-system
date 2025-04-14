import { Role } from './role';

export class Account {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    isActive: boolean; // Tracks whether the account is active
    jwtToken?: string;

    constructor(init?: Partial<Account>) {
        Object.assign(this, init);
    }

    // Method to activate the account
    activate(): string {
        if (this.isActive) {
            return 'Account is already active';
        }
        this.isActive = true;
        return 'Account activated successfully';
    }

    // Method to deactivate the account
    deactivate(): string {
        if (!this.isActive) {
            return 'Account is already deactivated';
        }
        this.isActive = false;
        return 'Account deactivated successfully';
    }
}