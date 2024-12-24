import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { CategoryMainService } from '../../services/category-main.service';
import { AlertMessageService } from '../../services/alert-message.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

declare const $:any;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {

  category: any = {};
  categoryList: any[] = [];
  categoryMain:any={};
  categoryMainList:any[]=[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  action: string = '';
  modalTitle: string = '';
  btnSave: boolean = false;
  btnEdit: boolean = false;
  btnRemove: boolean = false;
  categoryFrm = new FormGroup({
    categoryId: new FormControl(0),
    categoryName: new FormControl('', Validators.required),
    categoryNameKh: new FormControl('', Validators.required),
    remark: new FormControl(''),
    categoryMain: new FormGroup({
      categoryMainId: new FormControl(0, Validators.required),
    })
  });

  private unsubscribe$ = new Subject<void>();

  constructor(private categoryService: CategoryService, private categoryMainService:CategoryMainService, private alertMessage:AlertMessageService) {}

    ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      destroy: true,
      order:[[0,'desc']]
    };
    this.getAllCategories();
    this.getAllCategoryMain();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAllCategories(): void {
    if($.fn.dataTable.isDataTable('#dtCategory')){
      $('#dtCategory').dataTable().fnDestroy();
    }
    this.categoryService.getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res: any) => {
          this.categoryList = res.data;
          this.dtTrigger.next(null);
        },
        (error) => {
          console.error('Error fetching category main list', error);
        }
      );
  }
  getAllCategoryMain(){
    this.categoryMainService.getAll(this.category).subscribe(
      (res:any)=>{
        this.categoryMainList = res.data;
      }
    )
  }

  handleCRUD(action: string, data?: any): void {
    this.action = action;
    switch (action) {
      case 'create':
        this.modalTitle = 'បញ្ចូលប្រភេទទំនិញថ្មី';
        this.categoryFrm.reset({categoryId: 0});
        this.categoryFrm.enable();
        this.btnSave = true;
        this.btnEdit = false;
        this.btnRemove = false;
        break;
      case 'read':
        if (data) {
          this.modalTitle = 'ពត៌មានប្រភេទទំនិញ';
          this.categoryFrm.patchValue(data);
        }
        this.categoryFrm.disable();
        this.btnEdit = false;
        this.btnSave = false;
        this.btnRemove = false;
        break;
      case 'update':
        if (data) {
          this.modalTitle = 'កែប្រែពត៌មានប្រភេទទំនិញ';
          this.categoryFrm.patchValue(data);
          this.categoryFrm.enable();
          this.btnEdit = true;
          this.btnSave = false;
          this.btnRemove = false;
        }
        break;
      case 'delete':
        if (data) {
          this.modalTitle = 'លុបប្រភេទទំនិញ';
          this.categoryFrm.patchValue(data);
          this.categoryFrm.disable();
          this.btnSave = false;
          this.btnEdit = false;
          this.btnRemove = true;
        }
        break;
    }
  }

  onSubmit(): void {
    const formValue = this.categoryFrm.value;
    console.log("form value", formValue);

    if (this.categoryFrm.invalid) {
      this.categoryFrm.markAllAsTouched();
      return;
    }
    if (this.action === 'create') {
      this.categoryService.create(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllCategories();
        },
        (error) => {
          this.alertMessage.error(error?.message || 'An unknown error occurred', 'Error');
          console.log(error);
        }
      );
    } else if (this.action === 'update') {
      this.categoryService.update(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllCategories();
        },
        (error) => {
          this.alertMessage.error('Failed to update category', 'Error');
        }
      );
    } else if (this.action === 'delete') {
      this.categoryService.delete(formValue).subscribe(
        (res: any) => {
          this.alertMessage.success(res.messageKh, 'ជោគជ័យ');
          document.getElementById('btnClose')?.click();
          this.getAllCategories();
        },
        (error: any) => {
          this.alertMessage.error(error, 'Error');
        }
      );
    }
  }

  get categoryName(){
    return this.categoryFrm.get('categoryName');
  }
  get categoryNameKh(){
    return this.categoryFrm.get('categoryNameKh');
  }

}

