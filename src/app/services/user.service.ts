import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  getUser(id:string, username:string) {
    return this.http.get(`${API_URL}/authUser.php?username=${id}&password=${username}`, {responseType: 'json'})
  }
}
