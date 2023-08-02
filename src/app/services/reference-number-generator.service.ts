import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReferenceNumberGeneratorService {
  private ref:any;
  private details:any;
  constructor(private http: HttpClient) { }

  getRefNo() {
    return this.http.get(environment.API_URL+`/getLogicNumbers.php?remarks=document_referenceNumber`, {responseType: 'text'});
  }

  generateRefNo(type:String):any {
    let today:any = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = mm + '-' + dd + '-' + yyyy;

    return this.details = {
      date: today,
      file_type: type
    };
  }
}
