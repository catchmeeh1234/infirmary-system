import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public dataSourceUser:any;

  constructor(private http:HttpClient) { }

  getUser(id:string, username:string) {
    return this.http.get(`${environment.API_URL}/Accounts/authUser.php?username=${id}&password=${username}`, {responseType: 'json'})
  }

  fetchAllUserAccounts() {
    return this.http.get(`${environment.API_URL}/Accounts/viewAllUserAccounts.php`, {responseType: 'json'});
  }

  fetchOneUserAccount(userid) {
    return this.http.get(`${environment.API_URL}/Accounts/fetchOneAccount.php?userid=${userid}`, {responseType: 'json'});
  }

  fetchAccess() {
    return this.http.get(`${environment.API_URL}/Accounts/loadAccess.php`, {responseType: 'json'});
  }

  editUserAccount(userAccountDetails:any) {
    let json = JSON.stringify(userAccountDetails);
    let params = new FormData();
    params.append('userAccountDetails', json);

    return this.http.post(`${environment.API_URL}/Accounts/editUserAccount.php`, params, {responseType: 'json'});
  }

  resetUserAccount(userid) {
    let params = new FormData();
    params.append('userid', userid);
    return this.http.post(`${environment.API_URL}/Accounts/resetUserAccount.php`, params, {responseType: 'json'});
  }
}
