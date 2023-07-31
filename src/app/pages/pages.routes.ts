import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { ViewDocumentsComponent } from './view-documents/view-documents.component';
import { PrViewComponent } from './pr-view/pr-view.component';
import { PrAddComponent } from './pr-add/pr-add.component';
import { ItemsViewComponent } from './items-view/items-view.component';
import { ApprovePrComponent } from './approve-pr/approve-pr.component';
import { AccountViewComponent } from './accounts/account-view/account-view.component';
import { SampleCompComponent } from './sample-comp/sample-comp.component';
import { ProfileComponent } from './profile/profile.component';

const pagesRoutes: Routes = [
  	{ path: 'contact', component: ContactComponent ,data: { animation: 'contact' } },
  	{ path: 'about', component: AboutComponent ,data: { animation: 'about' }},
  	{ path: 'services', component: ServicesComponent ,data: { animation: 'services' }},
    { path: 'viewDocuments', component: ViewDocumentsComponent ,data: { animation: 'viewDocuments' }},
    { path: 'viewPR', component: PrViewComponent ,data: { animation: 'viewPR' }},
    { path: 'addPR', component: PrAddComponent ,data: { animation: 'addPR' }},
    { path: 'viewItems', component: ItemsViewComponent ,data: { animation: 'viewItems' }},
    { path: 'approvePr', component: ApprovePrComponent ,data: { animation: 'approvePr' }},
    { path: 'viewAccounts', component: AccountViewComponent ,data: { animation: 'viewAccounts' }},
    { path: 'profile', component: ProfileComponent ,data: { animation: 'profile' }},

    //{ path: 'sampleComponent', component: SampleCompComponent ,data: { animation: 'sampleComponent' }},

]
@NgModule({
  imports: [
    RouterModule.forChild(pagesRoutes)
  	],
  exports: [
    RouterModule
  ]
})
export class PagesRouterModule {}
