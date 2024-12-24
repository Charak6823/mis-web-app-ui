import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private url = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  getAllSuppliers(data:any): Observable<any> {
    return this.http.post<any>(this.url+'/suppliers',data);
  }
  getSupplierById(data:any): Observable<any>{
    return this.http.post<any>(this.url+'/getSupplierById',data)
  }
  create(data:any):Observable<any>{
    return this.http.post<any>(this.url+'/suppliers/create',data)
  }
  updateSupplier(data:any): Observable<any>{
    return this.http.post(this.url+'/suppliers/update',data)
  }
  deleteSupplier(data:any):Observable<any>{
    return this.http.post(this.url+'/suppliers/delete',data)
  }
}
