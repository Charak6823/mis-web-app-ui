import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryMainService {

  private url = 'http://localhost:8081';
  constructor(private http:HttpClient) { }
  getAll(data:any){
    return this.http.post(this.url+'/api/categoryMains',data);
  }
  getById(data:any){
    return this.http.post(this.url+'getCategoryMainById',data);
  }
  create(data:any){
    return this.http.post(this.url+'/api/categoryMains/create',data);
  }
  update(data:any){
    return this.http.post(this.url+'/api/categoryMains/update',data);
  }
  delete(data:any){
    return this.http.post(this.url+'/api/categoryMains/delete',data);
  }
}
