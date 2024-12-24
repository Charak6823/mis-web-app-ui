import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url:string='http://localhost:8081/api/'
  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get(this.url+'categories');
  }
  getById(data:any){
    return this.http.post(this.url+'getCategoryById',data);
  }
  create(data:any){
    return this.http.post(this.url+'categories/create',data);
  }
  update(data:any){
    return this.http.post(this.url+'categories/update',data);
  }
  delete(data:any){
    return this.http.post(this.url+'categories/delete',data)
  }
}
