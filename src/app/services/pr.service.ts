import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { API_URL } from '../constants';
import { observable } from 'rxjs';
import { StringDecoder } from 'string_decoder';

@Injectable({
  providedIn: 'root'
})
export class PrService {
  public dataSource:any;

  constructor(private http:HttpClient) { }

  loadPR() {
    return this.http.get(API_URL + '/api/pr.php', {responseType: 'json'});
  }

  loadPRNo() {
    return this.http.get(API_URL + '/api/prno.php', {responseType: 'text'});
  }

  loadItems(prnum) {
    return this.http.get(API_URL + `/api/pritems.php?prnum=${prnum}`, {responseType: 'json'});
  }

  approvePr(div, access) {
    return this.http.get(API_URL + `/api/approvepr.php?div=${div}&role=${access}`, {responseType: 'json'});
  }

  updateApproveStatus(prnum, status, username, button) {
    return this.http.get(API_URL + `/prApproveStatus.php?prnum=${prnum}&status=${status}&name=${username}&stat=${button}`, {responseType: 'text'});
  }

  //addPR(prno:string, datecreated:string, requestor:string, designation:string, division:string, purpose:string, prstatus:string) {
  addPR(prno:string, datecreated:string, requestor:string, designation:string, division:string, purpose:string, prstatus:string, items:any, username:string) {
    let json = JSON.stringify(items);
    let params = new FormData();
    params.append('prno', prno);
    params.append('datecreated', datecreated);
    params.append('requestor', requestor);
    params.append('designation', designation);
    params.append('division', division);
    params.append('purpose', purpose);
    params.append('prstatus', prstatus);
    params.append('items', json);
    params.append('username', username);

    return this.http.post(API_URL +'/addPR.php', params, { responseType: 'text'});
  }

  getUnitMeasurements() {
    return this.http.get(API_URL + `/viewUnits.php`, {responseType: 'json'});
  }

  getDivisions() {
    return this.http.get(API_URL + `/viewDivisions.php`, {responseType: 'json'});
  }

  // getEmp() {
  //   return this.http.get(API_URL + `/api/getEmp.php`)
  //     .pipe(
  //       map((response:[]) => response.map(item => item['full_name']))
  //     )
  // }

  getEmp() {
    //return this.http.get(API_URL + `/viewUnits.php`, {responseType: 'json'});
    return this.http.get(API_URL + `/api/getEmp.php`, {responseType: 'json'});
  }

}
