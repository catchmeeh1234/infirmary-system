import { Component, OnInit } from '@angular/core';
import { PrService } from '../services/pr.service';
import { SessionStorageService } from '../services/session-storage.service';
import { Division } from '../Types';

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

    constructor(private document:PrService, private sessionStorageService: SessionStorageService) { }

    ngOnInit() {
      this.onLoadDivisionsDashCard();
    }

    lightenColor(hex, amount): string {
      if (amount === 100) {
        return hex;
      }
      // Remove the '#' symbol if present
      hex = hex.replace('#', '');

      // Convert the hexadecimal to RGB
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);

      // Lighten the color by the specified amount
      const lightenedR = Math.floor(r + (255 - r) * (amount / 100));
      const lightenedG = Math.floor(g + (255 - g) * (amount / 100));
      const lightenedB = Math.floor(b + (255 - b) * (amount / 100));

      // Convert the lightened RGB values back to hexadecimal
      const lightenedHex = `#${(lightenedR.toString(16)).padStart(2, '0')}${(lightenedG.toString(16)).padStart(2, '0')}${(lightenedB.toString(16)).padStart(2, '0')}`;
      return lightenedHex;
    }

    onLoadDivisionsDashCard() {
      this.document.getDivisions()
      .subscribe((res:Division[]) => {
        let result:Division[] = res;
        let colorShadeIncrement = 100 / (result.length * 2);
        for (const div of result) {
          const iteration = 100 / (result.length * 2);
          const divisionName:string = div.division_name;
          const division_color_code:string = div.division_color_code;
          const lightenedColor = this.lightenColor(division_color_code, colorShadeIncrement); // Specify the desired lightening amount
          colorShadeIncrement += iteration;
          this.document.loadDocumentCounter(divisionName)
          .subscribe((data:any) => {
            let count_documents:any = data;
            let object = {colorDark: lightenedColor, colorLight: division_color_code, number: count_documents, title: divisionName, icon: 'account_circle'}
            this.dashCard.push(object);
          },
          (error:any) => {
            console.log(error);
          }
          );
        }

      },
      (error:any) => {
        console.log(error);
      }
      );
    }

    LoadTotalAS() {
        this.document.loadTotalAS()
        .subscribe(data => {
        this.totalas = parseInt(data);
        let object = {colorDark: '#5C6BC0', colorLight: '#7986CB', number: this.totalas, title: 'ADMINISTRATIVE SERVICE', icon: 'account_circle'}
        this.dashCard.push(object);
        });
    }
}
