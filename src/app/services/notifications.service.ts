import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, domain } from '../constants';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  public notificationCounter: number = 0;
  public notificationContent:any = [];

  constructor(private http: HttpClient, private sessionStorageService:SessionStorageService) { }

  viewNotifications(division, role) {
    let status:string;
    if (role === "Approver") {
      status = "For DM Approval";
    } else if (role === "Budget") {
      status = "For Budget Checking";
    } else if (role === "Cash") {
      status = "For Cash Allocation";
    } else if (role === "Encoder") {
      status = "Encoder";
    } else if (role === "Final Approver") {
      status = "Final Approver";
    }
    return this.http.get(`${API_URL}/viewNotifications.php?division=${division.toUpperCase()}&status=${status}`, {responseType: 'json'});
  }

  insertNotification(title:string, message: string, role: string, division: string, status: string, prno: string) {
    let params = new FormData();
    params.append('title', title);
    params.append('message', message);
    params.append('role', role);
    params.append('division', division);
    params.append('status', status);
    params.append('prno', prno);

    return this.http.post(`${API_URL}/addNotification.php`, params, {responseType: 'json'});
  }

  createDesktopNotification(message, icon) {

    const options = {
      body: message,
      icon: icon
    };
    const notification = new Notification('New Message', options );

    notification.onclick = function() {
      window.open(domain);
      //notification.close();
    };

  }

  createEmailNotification(prno, division, status) {
    let params = new FormData();
    params.append('prno', prno);
    params.append('division', division);
    params.append('status', status);

    //return this.http.post(`${API_URL}/email/mail.php`, params, {responseType: 'json'});
  }
}
