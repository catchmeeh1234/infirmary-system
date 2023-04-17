import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }

  getEmp() {
    //return this.http.get(API_URL + `/viewUnits.php`, {responseType: 'json'});
    return this.http.get(API_URL + `/api/getEmp.php`, {responseType: 'json'});
  }

  selectEmployee(fullname) {
    return this.http.get(API_URL + `/selectEmployee.php?fullname=${fullname}`, {responseType: 'json'});
  }
}
