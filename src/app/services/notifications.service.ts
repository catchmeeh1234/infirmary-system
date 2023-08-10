import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionStorageService } from './session-storage.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  public notificationCounter: number = 0;
  public notificationContent:any = [];

  constructor(private http: HttpClient, private sessionStorageService:SessionStorageService) { }

  updateNotifIsRead(notifid, role) {
    let params = new FormData();
    params.append('notifid', notifid);
    params.append('role', role);

    return this.http.post(`${environment.API_URL}/Notifications/updateNotifIsRead.php`, params, {responseType: 'text'});

  }

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
    return this.http.get(`${environment.API_URL}/Notifications/viewNotifications.php?division=${division.toUpperCase()}&status=${status}`, {responseType: 'json'});
  }

  resetNotificationCounter(userid) {
    let params = new FormData();
    params.append('userid', userid);

    return this.http.post(`${environment.API_URL}/Notifications/resetNotificationcounter.php`, params, {responseType: 'text'});
  }

  updateNotificationIsRead(notif_prno, notif_status, role) {
    let params = new FormData();
    params.append('notif_prno', notif_prno);
    params.append('notif_status', notif_status);
    params.append('role', role);

    return this.http.post(`${environment.API_URL}/Notifications/updateNotificationIsRead.php`, params, {responseType: 'json'});
  }

  markAllAsRead(notif_details:any, role:string) {

    let params = new FormData();
    params.append('notif_details', JSON.stringify(notif_details));
    params.append('role', role);

    return this.http.post(`${environment.API_URL}/Notifications/markAllNotifAsRead.php`, params, {responseType: 'text'});
  }

  updateOneNotification(notif_id, role:string) {
    let params = new FormData();
    params.append('notif_id', notif_id);
    params.append('role', role);

    return this.http.post(`${environment.API_URL}/Notifications/updateOneNotification.php`, params, {responseType: 'json'});

  }

  insertNotification(title:string, message: string, role: string, division: string, status: string, prno: string) {
    let params = new FormData();
    params.append('title', title);
    params.append('message', message);
    params.append('role', role);
    params.append('division', division);
    params.append('status', status);
    params.append('prno', prno);

    return this.http.post(`${environment.API_URL}/Notifications/addNotification.php`, params, {responseType: 'json'});
  }

  createDesktopNotification(message, icon) {

    const options = {
      body: message,
      icon: icon
    };
    const notification = new Notification('New Message', options );

    notification.onclick = function() {
      window.open(environment.domain);
      //notification.close();
    };

  }

  createEmailNotification(prno, division, status) {
    let params = new FormData();
    params.append('prno', prno);
    params.append('division', division);
    params.append('status', status);

    //return this.http.post(`${API_URL}/email/email.php`, params, {responseType: 'json'});
  }
}
