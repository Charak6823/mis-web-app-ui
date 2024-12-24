import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UnitTypeServiceService } from '../../services/unit-type-service.service';
import { AlertMessageService } from '../../services/alert-message.service';
import { FormControl, FormGroup } from '@angular/forms';

declare const $:any
@Component({
  selector: 'app-unit-type',
  templateUrl: './unit-type.component.html',
  styleUrls: ['./unit-type.component.css']
})
export class UnitTypeComponent implements OnInit, OnDestroy{
  unitType: any = {};
  unitTypeList: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  action: string = '';
  modalTitle: string = '';
  btnSave: boolean = false;
  btnEdit: boolean = false;
  btnRemove: boolean = false;
  unitTypeFrm = new FormGroup({
    unitTypeId: new FormControl(0),
    unitTypeName: new FormControl(''),
    unitTypeNameKh: new FormControl(''),
    qty: new FormControl(0),
    unitQty: new FormControl('')
  });

  private unsubscribe$ = new Subject<void>();

  constructor(
    private unitTypeService: UnitTypeServiceService,
    private alertMessage: AlertMessageService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      destroy: true
    };
    this.getAllUnitType();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAllUnitType(): void {
    if($.fn.dataTable.isDataTable('#dtUnitType')){
      $('#dtUnitType').dataTable().fnDestroy();
    }
    this.unitTypeService.getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res: any) => {
          this.unitTypeList = res.data;
          console.log('data', this.unitTypeList);
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
        this.modalTitle = 'បញ្ចូលខ្នាតលក់ថ្មី';
        this.unitTypeFrm.reset({ unitTypeId: 0});
        this.unitTypeFrm.enable();
        this.btnSave = true;
        this.btnEdit = false;
        this.btnRemove = false;
        break;
      case 'read':
        if (data) {
          this.modalTitle = 'ពត៌មានខ្នាតលក់';
          this.unitTypeFrm.patchValue(data);
        }
        this.unitTypeFrm.disable();
        this.btnEdit = false;
        this.btnSave = false;
        this.btnRemove = false;
        break;
      case 'update':
        if (data) {
          this.modalTitle = 'កែប្រែពត៌មានខ្នាតលក់';
          this.unitTypeFrm.patchValue(data);
          this.unitTypeFrm.enable();
          this.btnEdit = true;
          this.btnSave = false;
          this.btnRemove = false;
        }
        break;
      case 'delete':
        if (data) {
          this.modalTitle = 'លុបខ្នាតលក់';
          this.unitTypeFrm.patchValue(data);
          this.unitTypeFrm.disable();
          this.btnSave = false;
          this.btnEdit = false;
          this.btnRemove = true;
        }
        break;
    }
  }

  onSubmit(): void {
    const formValue = this.unitTypeFrm.value;
    if (this.action === 'create') {
      console.log(this.unitTypeFrm.value)
      this.unitTypeService.create(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllUnitType(); // Refresh categories after creation
        },
        (error) => {
          this.alertMessage.error(error, 'Error');
          console.log(error);
        }
      );
    } else if (this.action === 'update') {
      this.unitTypeService.update(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllUnitType(); // Refresh categories after update
        },
        (error) => {
          this.alertMessage.error('Failed to update category', 'Error');
        }
      );
    } else if (this.action === 'delete') {
      this.unitTypeService.remove(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllUnitType(); // Refresh categories after deletion
        },
        (error: any) => {
          this.alertMessage.error(error, 'Error');
        }
      );
    }
  }
}
