import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }

  getEmp(division:string) {
    return this.http.get(API_URL + `/api/getEmp.php?division=${division}`, {responseType: 'json'});
  }

  selectEmployee(fullname) {
    return this.http.get(API_URL + `/selectEmployee.php?fullname=${fullname}`, {responseType: 'json'});
  }

}
