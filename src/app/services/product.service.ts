import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private url='http://localhost:8081/api'

  constructor(private http:HttpClient) { }
  
  getAllProduct(data:any){
    return this.http.post(this.url+'/products',data)
  }

}
