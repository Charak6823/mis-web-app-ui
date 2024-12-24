import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent{
  testFrm = new FormGroup({
    name: new FormControl(''),
    address: new FormGroup({
      provinceId: new FormControl(0),
    })
  })
  categoryMainList = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
  ];
  constructor(productService:ProductService, private toastr:ToastrService){
  }

  // product.component.ts
  showMessage() {
    this.toastr.success('Success Message', 'Title', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true,
        positionClass: 'toast-top-right'
    });
  }

  onSubmit(){
    console.log(this.testFrm.value);
  }
}
