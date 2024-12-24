import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { WarehouseService } from 'src/app/services/warehouse.service';

declare const $:any;
@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit, OnDestroy{
  warehouse: any = {};
  warehouseList: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  action: string = '';
  modalTitle: string = '';
  btnSave: boolean = false;
  btnEdit: boolean = false;
  btnRemove: boolean = false;
  warehouseFrm = new FormGroup({
    warehouseId: new FormControl(0),
    warehouseName: new FormControl('', [Validators.required]),
    warehouseCode: new FormControl('', [Validators.required]),
    ownerName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/),
    ]),
    status: new FormControl('', [Validators.required]),
    tax: new FormControl(false),
  });

  private unsubscribe$ = new Subject<void>();
  constructor(private warehouseService: WarehouseService, private alertMessage:AlertMessageService) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      destroy: true,
      order:[[0,'desc']]
    };
    this.getAll();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAll(): void {
    if($.fn.dataTable.isDataTable('#dtWarehouse')){
      $('#dtWarehouse').dataTable().fnDestroy();
    }
    this.warehouseService.getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res: any) => {
          this.warehouseList = res.data;
          console.log('data', this.warehouseList);
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
        this.modalTitle = 'បញ្ចូលឃ្លាំងថ្មី';
        this.warehouseFrm.reset({ warehouseId: 0});
        this.warehouseFrm.enable();
        this.btnSave = true;
        this.btnEdit = false;
        this.btnRemove = false;
        break;
      case 'read':
        if (data) {
          this.modalTitle = 'ពត៌មានឃ្លាំង';
          this.warehouseFrm.patchValue(data);
        }
        this.warehouseFrm.disable();
        this.btnEdit = false;
        this.btnSave = false;
        this.btnRemove = false;
        break;
      case 'update':
        if (data) {
          this.modalTitle = 'កែប្រែពត៌មានឃ្លាំង';
          this.warehouseFrm.patchValue(data);
          this.warehouseFrm.enable();
          this.btnEdit = true;
          this.btnSave = false;
          this.btnRemove = false;
        }
        break;
      case 'delete':
        if (data) {
          this.modalTitle = 'លុបពត៌មានឃ្លាំង'
          this.warehouseFrm.patchValue(data);
          this.warehouseFrm.disable();
          this.btnSave = false;
          this.btnEdit = false;
          this.btnRemove = true;
        }
        break;
    }
  }

  onSubmit(): void {
    const formValue = this.warehouseFrm.value;
    if (this.warehouseFrm.invalid) {
      this.warehouseFrm.markAllAsTouched();
      return;
    }
    if (this.action === 'create') {
      this.warehouseService.create(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAll();
          console.log("form value", formValue);
        },
        (error) => {
          this.alertMessage.error(error, 'Error');
          console.log(error);
        }
      );
    } else if (this.action === 'update') {
      this.warehouseService.update(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAll(); // Refresh categories after update
        },
        (error) => {
          this.alertMessage.error('Failed to update category', 'Error');
        }
      );
    } else if (this.action === 'delete') {
      this.warehouseService.delete(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAll(); // Refresh categories after deletion
        },
        (error: any) => {
          this.alertMessage.error(error, 'Error');
        }
      );
    }
  }
}
