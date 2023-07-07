import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http:HttpClient) { }

  addDocument(file:File, refno:string) {

    let params = new FormData();
    params.append('document', file, file.name);
    params.append('refno', refno);
    params.append('number', refno);

    return this.http.post(API_URL +'/addDocument.php', params, {responseType: 'text'});
  }

  loadDocuments() {
    return this.http.get(API_URL + '/viewDocuments.php', {responseType: 'json'});
  }

  loadDocuments1(year:string) {
    //return this.http.get(`http://192.168.10.57:92/api/documents.php?year=${year}`, {responseType: 'json'});
    return this.http.get(`http://192.168.10.57:92/api/documents.php?year=${year}`, {responseType: 'json'});
  }

  deleteAllDocuments() {
     return this.http.get(API_URL + `/deleteAllDocuments.php`, {responseType: 'text'});
  }

  deleteDocument(id: number) {
    return this.http.get(API_URL + `/deleteDocument.php?id=${id}`, {responseType: 'text'});
  }

  editDocument(id: string, file: File) {
    let params = new FormData();
    params.append('document', file, file.name);
    params.append('document_id', id);
    return this.http.post(API_URL + `/editDocument.php`, params, {responseType: 'text'});
  }
}
