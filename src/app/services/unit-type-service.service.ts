import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnitTypeServiceService {
  private url:string='http://localhost:8081/api/'
  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get(this.url+'unitTypes');
  }
  getById(data:any){
    return this.http.post(this.url+'getUnitTypeById',data);
  }
  create(data:any){
    return this.http.post(this.url+'createUnitType',data);
  }
  update(data:any){
    return this.http.post(this.url+'updateUnitType',data);
  }
  remove(data:any){
    return this.http.post(this.url+'deleteUnitType',data);
  }
}
