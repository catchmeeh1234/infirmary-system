import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PrService } from '../../services/pr.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-sample-comp',
  templateUrl: './sample-comp.component.html',
  styleUrls: ['./sample-comp.component.scss']
})
export class SampleCompComponent implements OnInit {
  
  constructor(private document:PrService, private fb:FormBuilder) {

  }

  ngOnInit() {
  }

  
}