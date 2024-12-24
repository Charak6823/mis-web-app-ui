import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BrandServiceService } from '../../services/brand-service.service';
import { AlertMessageService } from '../../services/alert-message.service';

declare const $ : any;
@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit, OnDestroy{
  brandList: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  action: string = '';
  modalTitle: string = '';
  btnSave: boolean = false;
  btnEdit: boolean = false;
  btnRemove: boolean = false;
  brandFrm = new FormGroup({
    brandId: new FormControl(0),
    brandName: new FormControl(''),
    shortName: new FormControl(''),
    status: new FormControl(''),
  });
  private unsubscribe$ = new Subject<void>();

  constructor(private brandService: BrandServiceService, private alertMessage:AlertMessageService) {}

    ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      destroy: true,
      order:[[0,'desc']]
    };
    this.getAllBrands();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAllBrands(): void {
    if($.fn.dataTable.isDataTable('#dtBrands')){
      $('#dtBrands').dataTable().fnDestroy();
    }
    this.brandService.getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res: any) => {
          this.brandList = res.data;
          console.log('data', this.brandList);
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
        this.modalTitle = 'បញ្ចូលប្រែនថ្មី';
        this.brandFrm.reset({ brandId: 0});
        this.brandFrm.enable();
        this.btnSave = true;
        this.btnEdit = false;
        this.btnRemove = false;
        break;
      case 'read':
        if (data) {
          this.modalTitle = 'ពត៌មានប្រែន';
          this.brandFrm.patchValue(data);
        }
        this.brandFrm.disable();
        this.btnEdit = false;
        this.btnSave = false;
        this.btnRemove = false;
        break;
      case 'update':
        if (data) {
          this.modalTitle = 'កែប្រែពត៌មានប្រែន';
          this.brandFrm.patchValue(data);
          this.brandFrm.enable();
          this.btnEdit = true;
          this.btnSave = false;
          this.btnRemove = false;
        }
        break;
      case 'delete':
        if (data) {
          this.modalTitle = 'លុបទិន្នន័យប្រែន';
          this.brandFrm.patchValue(data);
          this.brandFrm.disable();
          this.btnSave = false;
          this.btnEdit = false;
          this.btnRemove = true;
        }
        break;
    }
  }

  onSubmit(): void {
    const formValue = this.brandFrm.value;
    if (this.brandFrm.invalid) {
      this.brandFrm.markAllAsTouched();
      return;
    }
    if (this.action === 'create') {
      this.brandService.create(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllBrands();
          console.log("form value", formValue);
        },
        (error) => {
          this.alertMessage.error(error.error.message, 'Error');
          console.log(error);
        }
      );
    } else if (this.action === 'update') {
      this.brandService.update(formValue.brandId,formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllBrands(); // Refresh categories after update
        },
        (error) => {
          this.alertMessage.error('Failed to update category', 'Error');
        }
      );
    } else if (this.action === 'delete') {
      this.brandService.remove(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllBrands(); // Refresh categories after deletion
        },
        (error: any) => {
          this.alertMessage.error(error, 'Error');
        }
      );
    }
  }
}
