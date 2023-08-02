import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SessionStorageService } from './session-storage.service';
import { Pr_details } from '../Types';

@Injectable({
  providedIn: 'root'
})
export class PrService {
  public dataSource:any;
  public dataSourcePRTable:any;

  public prnumber:string;
  public message:string;
  private statusColor:string;

  constructor(private http:HttpClient,
              private sessionStorageService:SessionStorageService,
  ) { }

  loadPR() {
    let div = this.sessionStorageService.getSession('division');
    let role = this.sessionStorageService.getSession('access');

    return this.http.get(`${environment.API_URL}/PR/fetchPR.php?division=${div}&role=${role}`, {responseType: 'json'});
  }

  loadPRNo() {
    return this.http.get(environment.API_URL + '/PR/incrementPRNo.php', {responseType: 'text'});
  }


  approvePr(div, access) {
    //return this.http.get(environment.API_URL + `/api/approvepr.php?div=${div}&role=${access}`, {responseType: 'json'});
    return this.http.get(environment.API_URL + `/PR/viewPRForApproval.php?div=${div}&role=${access}`, {responseType: 'json'});
  }


  prHistory(prnum:string) {
    return this.http.get(environment.API_URL + `/PR/prHistory.php?prnum=${prnum}`, {responseType: 'json'});
  }

  loadDocumentCounter(division:string) {
    return this.http.get(environment.API_URL + `/PR/loadDocumentCounter.php?division=${division}`, {responseType: 'text'});
  }

  //addPR(prno:string, datecreated:string, requestor:string, designation:string, division:string, purpose:string, prstatus:string) {

  addPR(prno:string, pr_details:any, username:string) {
    let json = JSON.stringify(pr_details);
    let params = new FormData();
    params.append('prno', prno);
    params.append('pr_details', json);
    params.append('username', username);

    return this.http.post(environment.API_URL +'/PR/addPR.php', params, { responseType: 'text'});
  }

  editPR(prDetails:any) {
    let params = new FormData();
    let json = JSON.stringify(prDetails);
    params.append('pr_details', json);

    return this.http.post(environment.API_URL +'/PR/editPR.php', params, { responseType: 'text'});
  }

  getUnitMeasurements() {
    return this.http.get(environment.API_URL + `/Units/viewUnits.php`, {responseType: 'json'});
  }

  getDivisions() {
    return this.http.get(environment.API_URL + `/Divisions/viewDivisions.php`, {responseType: 'json'});
  }

  getPrLabelStatus() {
    return this.http.get(environment.API_URL + `/PR/viewPrLabelStatus.php`, {responseType: 'json'});
  }

  updatePrRequestAPI(prDetails:any) {
    return this.http.post(environment.API_URL + `/PR/cancelPR.php`, prDetails, {responseType: 'json'});
  }
  loadPrAndItems(prno:string) {
    //console.log(prno);
    return this.http.get(environment.API_URL + `/PR/loadPrAndItems.php?prno=${prno}`, {responseType: 'json'});
  }

  loadDisapprovePR(division) {
    return this.http.get(environment.API_URL + `/PR/viewDisapprovePR.php?division=${division}`, {responseType: 'json'});
  }

  //* monthly total pr */
  PRTotalJan() {
    return this.http.get(environment.API_URL + '/PR/JanTotalPR.php', {responseType: 'json'});
  }


  // update pr counter
  updatePRPrintCounter(prno:string) {
    let params = new FormData();
    params.append('prno', prno);

    return this.http.post(environment.API_URL + `/PR/updatePRPrintCounter.php`, params, {responseType: 'json'});
  }
}
