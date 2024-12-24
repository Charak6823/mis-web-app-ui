import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { CategoryMainService } from 'src/app/services/category-main.service';

declare var $: any;
@Component({
  selector: 'app-category-main',
  templateUrl: './category-main.component.html',
  styleUrls: ['./category-main.component.css']
})
export class CategoryMainComponent implements OnInit,OnDestroy{

  categoryMain: any = {};
  categoryMainList: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  action: string = '';
  modalTitle: string = '';
  btnSave: boolean = false;
  btnEdit: boolean = false;
  btnRemove: boolean = false;
  categoryMainFrm = new FormGroup({
    categoryMainId: new FormControl(0),
    name: new FormControl(''),
    shortName: new FormControl('')
  });

  private unsubscribe$ = new Subject<void>();

  constructor(
    private categoryMainService: CategoryMainService,
    private alertMessage: AlertMessageService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      destroy: true
    };
    this.getAllCategoryMain();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAllCategoryMain(): void {
    if($.fn.dataTable.isDataTable('#dtCategoryMain')){
      $('#dtCategoryMain').dataTable().fnDestroy();
    }
    this.categoryMainService.getAll(this.categoryMain)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res: any) => {
          this.categoryMainList = res.data;
          console.log('data', this.categoryMainList);
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
        this.modalTitle = 'បញ្ចូលប្រភេទទំនិញថ្មី';
        this.categoryMainFrm.reset({ categoryMainId: 0});
        this.categoryMainFrm.enable();
        this.btnSave = true;
        this.btnEdit = false;
        this.btnRemove = false;
        break;
      case 'read':
        if (data) {
          this.modalTitle = 'ពត៌មានប្រភេទទំនិញមេ';
          this.categoryMainFrm.patchValue(data);
        }
        this.categoryMainFrm.disable();
        this.btnEdit = false;
        this.btnSave = false;
        this.btnRemove = false;
        break;
      case 'update':
        if (data) {
          this.modalTitle = 'កែប្រែប្រភេទទំនិញមេ';
          this.categoryMainFrm.patchValue(data);
          this.categoryMainFrm.enable();
          this.btnEdit = true;
          this.btnSave = false;
          this.btnRemove = false;
        }
        break;
      case 'delete':
        if (data) {
          this.modalTitle = 'លុបប្រភេទទំនិញមេ';
          this.categoryMainFrm.patchValue(data);
          this.categoryMainFrm.disable();
          this.btnSave = false;
          this.btnEdit = false;
          this.btnRemove = true;
        }
        break;
    }
  }

  onSubmit(): void {
    const formValue = this.categoryMainFrm.value;
    if (this.action === 'create') {
      this.categoryMainService.create(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllCategoryMain(); // Refresh categories after creation
        },
        (error) => {
          this.alertMessage.error(error.error.message, 'Error')
          console.log();
        }
      );
    } else if (this.action === 'update') {
      this.categoryMainService.update(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllCategoryMain(); // Refresh categories after update
        },
        (error) => {
          this.alertMessage.error('Failed to update category', 'Error');
        }
      );
    } else if (this.action === 'delete') {
      this.categoryMainService.delete(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllCategoryMain(); // Refresh categories after deletion
        },
        (error: any) => {
          this.alertMessage.error(error, 'Error');
        }
      );
    }
  }
}
