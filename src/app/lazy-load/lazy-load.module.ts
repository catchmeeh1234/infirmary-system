import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule } from '@angular/router';

import { AuthModule } from '../auth/auth.module';

import { AuthGuard } from '../auth.guard';
import { LoginComponent } from '../pages/login/login.component';

const routes: Routes = [
    {path: 'auth', loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule)},
    {path: 'register', loadChildren: () => import('../register/register.module').then(m => m.RegisterModule)},
    {path: 'login', loadChildren: () => import('../pages/login/login.module').then(m => m.LoginModule)},
    // {path: 'editor', loadChildren: () => import('../editor/editor.module').then(m => m.EditorModule)},

    {path: '', redirectTo: '/login', pathMatch: 'full'},
    // {path: 'login', component: LoginComponent, canActivate: [AuthGuard]}
]

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class LazyLoadModule { }
