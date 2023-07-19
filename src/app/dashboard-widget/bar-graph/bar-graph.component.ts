import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { PrService } from '../../services/pr.service';


@Component({
  selector: 'cdk-bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.scss']
})
export class BarGraphComponent implements OnInit {
  public arrayDivisions:any[] = [];
  public arrayDisapprovePRCount:any[] = [];

  constructor(private pr:PrService) {
    // this.arrayDivisions = [];
    // this.arrayDisapprovePRCount = [];
  }

  ngOnInit() {
      setTimeout(() => {
          this.viewDisapprovePR();
      },500)
  }

  viewDisapprovePR() {
    // this.arrayDivisions ;
    // this.arrayDisapprovePRCount = [];

    this.pr.getDivisions()
    .subscribe(data => {
      let result:any = data;
      for (const div of result) {
        this.arrayDivisions.push(div.division_name);
        this.pr.loadDisapprovePR(div.division_name)
        .subscribe((res:any) => {
          let count:any = res.length;
          this.arrayDisapprovePRCount.push(count);
          //console.log(res.length);
        });
      }
    });

    setTimeout(() => {
      new Chart('dash-bar-graph', {
          type: 'bar',
          data: {
              labels: this.arrayDivisions,
              datasets: [
                  {
                      backgroundColor: 'rgba(92, 107, 192, .7)',
                      borderColor: 'rgba(92, 107, 192, .7)',
                      data: this.arrayDisapprovePRCount,
                      label: 'Dataset',
                      fill: 'false'
                  },
                  // {
                  //     backgroundColor: 'rgba(66, 165, 245, .7)',
                  //     borderColor: 'rgba(69, 39, 160, .7)',
                  //     data: [80, 88, 67, 95, 76, 60, 67, 95,95,66],
                  //     label: 'Dataset',
                  //     fill: 'false'
                  // },
                  // {
                  //     backgroundColor: 'rgba(38, 166, 154, .7)',
                  //     borderColor: 'rgba(69, 39, 160, .7)',
                  //     data: [60, 88, 70, 67, 27, 83, 78, 88,95,60],
                  //     label: 'Dataset',
                  //     fill: 'false'
                  // },
                  // {
                  //     backgroundColor: 'rgba(102, 187, 106, .7)',
                  //     borderColor: 'rgba(255, 99, 132)',
                  //     data: [75, 55, 55, 95, 66, 88, 70, 78,77,100],
                  //     label: 'Dataset',
                  //     fill: 'false'
                  // }
              ]
          },
          options: {
            legend: {
                display: false
            },
            elements : {
                line: {
                    tension: 0.000001
                }
            },
            maintainAspectRatio: false,
            plugins: {
                filler: {
                    propagate: false
                }
            },
            title: {
                display: true,
                text: 'Disapproved PR'
            }
        }
      })
    }, 1000);

  }

  createBarGraph() {


  }
}
