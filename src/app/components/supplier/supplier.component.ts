import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';
import { Subject,takeUntil } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert-message.service';

declare const $: any;
@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
})
export class SupplierComponent implements OnInit, OnDestroy {

  supplier: any = {};
  supplierList: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  action: string = '';
  modalTitle: string = '';
  btnSave: boolean = false;
  btnEdit: boolean = false;
  btnRemove: boolean = false;
  supplierFrm = new FormGroup({
    supplierId: new FormControl(0),
    supplierName: new FormControl('', [Validators.required]),
    contactName: new FormControl('', [Validators.required]),
    contactPhone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/),
    ]),
    sex: new FormControl('', Validators.required),
    address: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    warehouseId:new FormControl(0)
  });
  
  private unsubscribe$ = new Subject<void>();
  constructor(private supplierService: SupplierService, private alertMessage:AlertMessageService) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      destroy: true,
      order:[[0,'desc']]
    };
    this.getAllSuppliers();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAllSuppliers(): void {
    if($.fn.dataTable.isDataTable('#dtSupplier')){
      $('#dtSupplier').dataTable().fnDestroy();
    }
    this.supplierService.getAllSuppliers(this.supplier)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res: any) => {
          this.supplierList = res.data;
          console.log('data', this.supplierList);
          this.dtTrigger.next(null);
        },
        (error) => {
          console.error('Error fetching category main list', error);
        }
      );
  }

  handleCRUD(action: string, data?: any): void {
    this.action = action;
    switch (action) {
      case 'create':
        this.modalTitle = 'បញ្ចូលអ្នកផ្គត់ផ្គង់ថ្មី';
        this.supplierFrm.reset({ supplierId: 0,warehouseId:1});
        this.supplierFrm.enable();
        this.btnSave = true;
        this.btnEdit = false;
        this.btnRemove = false;
        break;
      case 'read':
        if (data) {
          this.modalTitle = 'ពត៌មានអ្នកផ្គត់ផ្គង់';
          this.supplierFrm.patchValue(data);
        }
        this.supplierFrm.disable();
        this.btnEdit = false;
        this.btnSave = false;
        this.btnRemove = false;
        break;
      case 'update':
        if (data) {
          this.modalTitle = 'កែប្រែពត៌មានអ្នកផ្គត់ផ្គង់';
          this.supplierFrm.patchValue(data);
          this.supplierFrm.enable();
          this.btnEdit = true;
          this.btnSave = false;
          this.btnRemove = false;
        }
        break;
      case 'delete':
        if (data) {
          this.modalTitle = 'លុបអ្នកអ្នកផ្គត់ផ្គង់';
          this.supplierFrm.patchValue(data);
          this.supplierFrm.disable();
          this.btnSave = false;
          this.btnEdit = false;
          this.btnRemove = true;
        }
        break;
    }
  }

  onSubmit(): void {
    const formValue = this.supplierFrm.value;
    if (this.supplierFrm.invalid) {
      this.supplierFrm.markAllAsTouched();
      return;
    }
    if (this.action === 'create') {
      this.supplierService.create(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllSuppliers();
          console.log("form value", formValue);
        },
        (error) => {
          this.alertMessage.error(error, 'Error');
          console.log(error);
        }
      );
    } else if (this.action === 'update') {
      this.supplierService.updateSupplier(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllSuppliers(); // Refresh categories after update
        },
        (error) => {
          this.alertMessage.error('Failed to update category', 'Error');
        }
      );
    } else if (this.action === 'delete') {
      this.supplierService.deleteSupplier(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllSuppliers(); // Refresh categories after deletion
        },
        (error: any) => {
          this.alertMessage.error(error, 'Error');
        }
      );
    }
  }

}

