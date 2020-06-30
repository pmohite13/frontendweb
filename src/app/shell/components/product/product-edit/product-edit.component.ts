import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/shared/data.service';
import { IProductCategory, IProduct, IProductAttributeLookup, IProductAttribute } from 'src/app/shared/interface';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {
  currentProductId: number;
  currentProduct: IProduct;
  productAttributesLookup: IProductAttributeLookup[] = [];
  productAttributes: IProductAttribute[] = [];
  productCategories: IProductCategory[] = [];
  currProductCategory: IProductCategory;
  productFormGroup: FormGroup;
  title: string = 'Edit Product';
  showLoading: boolean = true;

  dataSource: MatTableDataSource<AbstractControl>;
  displayedColumns: string[] = ['attributeId', 'attributeName', 'attributeValue', 'displayLink'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private formBuilder: FormBuilder) { this.buildFormGroup(); }

  ngOnInit() {
    this.currentProductId = this.route.snapshot.params["id"];
    /* fork Join can be used here as its async operation */
    this.getProductCategories();
    this.productFormGroup.patchValue({ productId: this.currentProductId });
    console.log(this.currentProductId);
  }

  getProductCategories() {
    this.dataService
      .getProductCategories()
      .subscribe((categories: IProductCategory[]) => {
        this.productCategories = categories;
        this.getProductById(this.currentProductId);
      });
  }

  getProductById(productId: number) {
    this.dataService
      .getProductById(productId)
      .subscribe((product: IProduct) => {
        this.currentProduct = product;
        this.productAttributes = this.currentProduct.productAttribute;
        this.patchProduct();
        // this.setProductAttributeForm();
      });
  }

  public productCategoryChange(category: IProductCategory): any {

    // this.clearProductAttributeList();
    this.dataService.getAttributesForSelectedCategory(category.prodCatId)
      .subscribe((productAttributes: IProductAttributeLookup[]) => {
        this.productAttributesLookup = productAttributes.sort((a1, a2) => { return a1.attributeName && a2.attributeName && (a1.attributeName.toLowerCase() > a2.attributeName.toLowerCase()) ? 1 : -1; });
        this.setProductAttributeForm();
      },
        (err) => console.log(err));


  }

  private patchProduct() {

    this.currProductCategory = this.productCategories.find(c => c.prodCatId === this.currentProduct.prodCatId);
    this.productCategoryChange(this.currProductCategory);
    this.productFormGroup.patchValue({
      prodCatId: this.currProductCategory.prodCatId,
      prodName: this.currentProduct.prodName,
      prodCat: this.currProductCategory,
      prodDescription: this.currentProduct.prodDescription
    });
  }

  private buildFormGroup() {
    this.productFormGroup = this.formBuilder.group({
      productId: [0],
      prodCatId: [0],
      prodName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      prodCat: [''],
      prodDescription: [''],
      productAttribute: this.formBuilder.array([])
    });
  }

  setProductAttributeForm() {
    const productAttributeCtrl = this.productFormGroup.get('productAttribute') as FormArray;
    this.productAttributes.forEach(p => {
      let newfg = this.patchPOProductValue(p);
      if (newfg) {
        productAttributeCtrl.push(newfg);
      }
    });

    this.dataSource = new MatTableDataSource<AbstractControl>(productAttributeCtrl.controls);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.showLoading = false;
  }

  patchPOProductValue(productAttribute: IProductAttribute) {
    if (productAttribute) {
      let attrName = this.productAttributesLookup.find(pa => pa.attributeId === productAttribute.attributeId).attributeName;

      let fg = this.formBuilder.group({
        attributeId: productAttribute.attributeId,
        attributeName: attrName,
        attributeValue: productAttribute.attributeValue,
        productAttributeId: productAttribute.productAttributeId,
        productId: productAttribute.productId
      });

      return fg;
    }

  }

  submit() {   
    let product: IProduct;
    product = this.productFormGroup.value;
    this.dataService.updateProduct(product)
      .subscribe((po: IProduct) => {       
        this.router.navigate(['shell/listproduct']);
      },
        (err) => console.log(err));
  }

  gotoHome() {
    this.router.navigateByUrl('shell/listproduct');
  }

}
