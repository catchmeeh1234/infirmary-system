import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }

  getEmp(division:string) {
    return this.http.get(environment.API_URL + `/Employees/getEmp.php?division=${division}`, {responseType: 'json'});
  }

  selectEmployee(fullname) {
    return this.http.get(environment.API_URL + `/Employees/selectEmployee.php?fullname=${fullname}`, {responseType: 'json'});
  }

}
