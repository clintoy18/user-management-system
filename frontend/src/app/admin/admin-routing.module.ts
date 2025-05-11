import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';
import { Role } from '@app/_models';

import { SubNavComponent } from './subnav.component'; 
import { LayoutComponent } from './layout.component'; 
import { OverviewComponent } from './overview.component';

const accountsModule = () => import('./accounts/accounts.module').then(x => x.AccountsModule);
const requestsModule = () => import('./requests/requests.module').then(x => x.RequestsModule);

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
        children: [
            { path: '', component: OverviewComponent },
            { path: 'accounts', loadChildren: accountsModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
            { path: 'requests', loadChildren: requestsModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }