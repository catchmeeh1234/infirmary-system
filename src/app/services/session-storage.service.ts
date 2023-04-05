import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  setSession(key: string, value: any): void {
    sessionStorage.setItem(key, value);
  }
  getSession(key:string) {
    return sessionStorage.getItem(key);
  }
  removeSession() {
      sessionStorage.clear();
  }
}
