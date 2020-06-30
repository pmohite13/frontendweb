import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IProduct, IPagedResults } from 'src/app/shared/interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataService } from 'src/app/shared/data.service';
import { Router } from '@angular/router';
import { merge, Observable, of as observableOf } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-product-home',
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.scss']
})
export class ProductHomeComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ["prodName", "prodDescription", "prodCat", "displayLink"];
  products: IProduct[] = [];
  dataSource: MatTableDataSource<IProduct>;
  title = "Products";
  pageSize: number = 5;
  totalProducts: number = 0;
  showLoading: boolean = true;
  isLoadingResults = true;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() {  
  }

  ngAfterViewInit() {
    this.getProducts();
  }

  getProducts() {
  
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
         
          this.isLoadingResults = true;
          return this.dataService.getProducts(this.paginator.pageIndex, this.pageSize);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.totalProducts = data.totalRecords;         
          return data.results;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe((data: IProduct[]) => {
        
        this.products = data;        
      });
  }

 

  createProduct() {
    this.router.navigateByUrl('shell/addproduct');
  }

  getDetails(detail: IProduct) {   
    this.router.navigate(["shell/editproduct", detail.productId]);
  }

}
