import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { DataService } from 'src/app/shared/data.service';
import { Router } from '@angular/router';
import { IProductCategory, IProductAttribute, IProductAttributeLookup, IProduct } from 'src/app/shared/interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {

  productFormGroup: FormGroup;
  productCategories: IProductCategory[];
  productAttributes: IProductAttributeLookup[] = [];
  dataSource: MatTableDataSource<AbstractControl>;
  displayedColumns: string[] = ['attributeId', 'attributeName', 'attributeValue', 'displayLink'];
  title: string = 'Create New Product';
  showLoading: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router
  ) {
    this.buildFormGroup();
  }

  ngOnInit() {
    this.getProductCategories();
    this.setProductAttributeForm();
  }

  getProductCategories() {  
    this.dataService
      .getProductCategories()
      .subscribe((categories: IProductCategory[]) => {
        this.productCategories = categories;
        this.showLoading = false;
      });
  }

  public productCategoryChange(category: IProductCategory): any {    
    this.clearProductAttributeList();
    this.dataService.getAttributesForSelectedCategory(category['value'].prodCatId)
      .subscribe((productAttributes: IProductAttributeLookup[]) => {
        this.productAttributes = productAttributes.sort((a1, a2) => { return a1.attributeName && a2.attributeName && (a1.attributeName.toLowerCase() > a2.attributeName.toLowerCase()) ? 1 : -1; });
        this.setProductAttributeForm();
      },
        (err) => console.log(err));


  }


  private clearProductAttributeList() {
    this.productAttributes = [];
  }

  setProductAttributeForm() {   
    const productAttributeCtrl = this.productFormGroup.get('productAttribute') as FormArray;
    productAttributeCtrl.controls = [];
    this.productAttributes.forEach(p => {      
      let newfg = this.patchPOProductValue(p);
      if (newfg) {
        productAttributeCtrl.push(newfg);
      }
    });
    this.dataSource = new MatTableDataSource<AbstractControl>(productAttributeCtrl.controls);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  patchPOProductValue(productAttribute) {   

    if (productAttribute) {
      let fg = this.formBuilder.group({
        attributeId: productAttribute.attributeId,
        attributeName: productAttribute.attributeName,
        attributeValue: ''
      });

      return fg;
    }

  }


  private buildFormGroup() {
    this.productFormGroup = this.formBuilder.group({
      prodName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      prodCat: ['', Validators.required],
      prodDescription: [''],
      productAttribute: this.formBuilder.array([])
    });
  }

  gotoHome() {
    this.router.navigateByUrl('shell/listproduct');
  }

  submit() {
   
    let product: IProduct;
    product = this.productFormGroup.value;

    this.dataService.insertProduct(product)
      .subscribe((po: IProduct) => {       
        this.router.navigate(['shell/listproduct']);
      },
        (err) => console.log(err));
  }

}
