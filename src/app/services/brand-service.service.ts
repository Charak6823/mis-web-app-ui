import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrandServiceService {
  getAllBrands() {
    throw new Error('Method not implemented.');
  }

  private url:string='http://localhost:8081/api/'
  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get(this.url+'brands');
  }
  getById(data:any){
    return this.http.post(this.url+'getBrandById',data);
  }
  create(data:any){
    return this.http.post(this.url+'brands/create',data);
  }
  update(id:any,data:any){
    return this.http.put(this.url+'brands/'+id,data);
  }
  remove(data:any){
    return this.http.post(this.url+'brands/delete',data);
  }
}
