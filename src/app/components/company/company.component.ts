import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { CompanyService } from 'src/app/services/company.service';

declare const $ : any;
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit, OnDestroy{
  company: any = {};
  companyList: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  action: string = '';
  modalTitle: string = '';
  btnSave: boolean = false;
  btnEdit: boolean = false;
  btnRemove: boolean = false;
  companyFrm = new FormGroup({
    companyId: new FormControl(0),
    companyName: new FormControl(''),
    description: new FormControl(''),
    status: new FormControl(''),
  });
  private unsubscribe$ = new Subject<void>();

  constructor(private companyService: CompanyService, private alertMessage:AlertMessageService) {}

    ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      destroy: true,
      order:[[0,'desc']]
    };
    this.getAllCompany();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAllCompany(): void {
    if($.fn.dataTable.isDataTable('#dtCompany')){
      $('#dtCompany').dataTable().fnDestroy();
    }
    this.companyService.getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res: any) => {
          this.companyList = res.data;
          console.log('data', this.companyList);
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
        this.modalTitle = 'បញ្ចូលក្រុមហ៊ុនថ្មី';
        this.companyFrm.reset({ companyId: 0});
        this.companyFrm.enable();
        this.btnSave = true;
        this.btnEdit = false;
        this.btnRemove = false;
        break;
      case 'read':
        if (data) {
          this.modalTitle = 'ពត៌មានក្រុមហ៊ុន';
          this.companyFrm.patchValue(data);
        }
        this.companyFrm.disable();
        this.btnEdit = false;
        this.btnSave = false;
        this.btnRemove = false;
        break;
      case 'update':
        if (data) {
          this.modalTitle = 'កែប្រែពត៌មានក្រុមហ៊ុន';
          this.companyFrm.patchValue(data);
          this.companyFrm.enable();
          this.btnEdit = true;
          this.btnSave = false;
          this.btnRemove = false;
        }
        break;
      case 'delete':
        if (data) {
          this.modalTitle = 'លុបទិន្នន័យក្រុមហ៊ុន';
          this.companyFrm.patchValue(data);
          this.companyFrm.disable();
          this.btnSave = false;
          this.btnEdit = false;
          this.btnRemove = true;
        }
        break;
    }
  }

  onSubmit(): void {
    const formValue = this.companyFrm.value;
    if (this.companyFrm.invalid) {
      this.companyFrm.markAllAsTouched();
      return;
    }
    if (this.action === 'create') {
      this.companyService.create(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllCompany();
          console.log("form value", formValue);
        },
        (error) => {
          this.alertMessage.error(error, 'Error');
          console.log(error);
        }
      );
    } else if (this.action === 'update') {
      this.companyService.update(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllCompany(); // Refresh categories after update
        },
        (error) => {
          this.alertMessage.error('Failed to update category', 'Error');
        }
      );
    } else if (this.action === 'delete') {
      this.companyService.remove(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllCompany(); // Refresh categories after deletion
        },
        (error: any) => {
          this.alertMessage.error(error, 'Error');
        }
      );
    }
  }
}
