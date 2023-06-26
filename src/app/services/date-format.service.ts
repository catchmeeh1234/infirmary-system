import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {

  constructor() { }

  formatDate(date: Date): string {
    if (date === null || date === undefined) {
      return;
    }
    const year = date.getFullYear().toString();
    const month = this.padZero(date.getMonth() + 1); // Adding 1 since month is zero-based
    const day = this.padZero(date.getDate());

    return `${year}-${month}-${day}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }
}
