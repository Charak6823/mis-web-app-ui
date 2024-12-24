import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  url:string ='http://localhost:8081/api'
  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get(this.url+'/warehouses');
  }
  getById(data:any){
    return this.http.post(this.url+'/warehouses/getById',data)
  }
  create(data:any){
    return this.http.post(this.url+'/warehouses/create',data)
  }
  update(data:any){
    return this.http.post(this.url+'/warehouses/update',data);
  }
  delete(data:any){
    return this.http.post(this.url+'/warehouses/delete',data);
  }
}
