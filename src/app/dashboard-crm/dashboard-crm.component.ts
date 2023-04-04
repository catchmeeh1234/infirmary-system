import { Component, OnInit } from '@angular/core';
import { PrService } from '../services/pr.service';

@Component({
    selector: 'app-dashboard-crm',
    templateUrl: './dashboard-crm.component.html',
    styleUrls: ['./dashboard-crm.component.scss']
})

export class DashboardCrmComponent implements OnInit {

    public totalas:number;
    public totalem:number;
    public totalfc:number;
    public totalpr:number;

    public dashCard = [
        /*{ colorDark: '#5C6BC0', colorLight: '#7986CB', number: this.totalas, title: 'ADMINISTRATIVE SERVICE', icon: 'local_grocery_store' },
        { colorDark: '#42A5F5', colorLight: '#64B5F6', number: this.totalem, title: 'ENGINEERING AND MAINTENANCE', icon: 'new_releases' },
        { colorDark: '#26A69A', colorLight: '#4DB6AC', number: this.totalfc, title: 'FINANCE AND COMMERCIAL', icon: 'assignments' },
        { colorDark: '#66BB6A', colorLight: '#81C784', number: this.totalpr, title: 'PRODUCTION', icon: 'account_balance' }*/
    ];

    tableData = [
        { country: 'India', sales: 5400, percentage: '40%' },
        { country: 'Us', sales: 3200, percentage: '30.33%' },
        { country: 'Australia', sales: 2233, percentage: '18.056%' },
        { country: 'Spaim', sales: 600, percentage: '6%' },
        { country: 'China', sales: 200, percentage: '4.50%' },
        { country: 'Brazil', sales: 100, percentage: '2.50%' },
    ];

    constructor(private document:PrService) { }

    ngOnInit() {
        this.LoadTotalAS();
        this.LoadTotalEM();
        this.LoadTotalFC();
        this.LoadTotalPR();
    }

    LoadTotalAS() {
        this.document.loadTotalAS()
        .subscribe(data => {
        this.totalas = parseInt(data);
        let object = {colorDark: '#5C6BC0', colorLight: '#7986CB', number: this.totalas, title: 'ADMINISTRATIVE SERVICE', icon: 'account_circle'}
        this.dashCard.push(object);
        });
    }


    LoadTotalEM() {
        this.document.loadTotalEM()
        .subscribe(data => {
        this.totalem = parseInt(data);
        let object = {colorDark: '#42A5F5', colorLight: '#64B5F6', number: this.totalem, title: 'ENGINEERING AND MAINTENANCE', icon: 'build'}
        this.dashCard.push(object);
        });
    }

    LoadTotalFC() {
        this.document.loadTotalFC()
        .subscribe(data => {
        this.totalfc = parseInt(data);
        let object = {colorDark: '#26A69A', colorLight: '#4DB6AC', number: this.totalfc, title: 'FINANCE AND COMMERCIAL', icon: 'library_books'}
        this.dashCard.push(object);
        });
    }

    LoadTotalPR() {
        this.document.loadTotalPR()
        .subscribe(data => {
        this.totalpr = parseInt(data);
        let object = {colorDark: '#66BB6A', colorLight: '#81C784', number: this.totalpr, title: 'PRODUCTION', icon: 'waves'}
        this.dashCard.push(object);
        });
    }

}
