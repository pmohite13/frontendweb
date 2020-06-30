import { Injectable } from "@angular/core";
import { IProduct, IPagedResults, IProductCategory, IProductAttributeLookup } from "./interface";
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse
} from "@angular/common/http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Injectable()
export class DataService {
  baseApiUrl = "https://localhost:44331/";
  productEndPointUrl = "api/products";
  productCategoryEndPointUrl = "api/productcategories";

  constructor(private http: HttpClient) { }


  getProducts(page: number, pageSize: number): Observable<IPagedResults<IProduct[]>> {
    return this.http.get<IProduct[]>(`${this.baseApiUrl + this.productEndPointUrl}?page=${page}&pageSize=${pageSize}`, { observe: 'response' })
      .pipe(
        map((res) => {        
          const totalRecords = +res.headers.get('X-ProductCount');
          let products = res.body as IProduct[];
          return {
            results: products,
            totalRecords: totalRecords
          };
        }),
        catchError(this.handleError)
      );
  }

  getProductCategories(): Observable<IProductCategory[]> {
    let url = this.baseApiUrl + this.productCategoryEndPointUrl;
    return this.http
      .get<IProductCategory[]>(`${url}?page=${0}&pageSize=${10}`)
      .pipe(catchError(this.handleError));
  }

  getAttributesForSelectedCategory(categoryId: number): Observable<IProductAttributeLookup[]> {
    let url = this.baseApiUrl + this.productCategoryEndPointUrl + '/' + categoryId + '/attributes';
    return this.http.get<IProductAttributeLookup[]>(`${url}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  insertProduct(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.baseApiUrl + this.productEndPointUrl, product)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  updateProduct(product: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(this.baseApiUrl + this.productEndPointUrl + "/" + product.productId, product)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http
      .get<IProduct>(this.baseApiUrl + this.productEndPointUrl + "/" + id)
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return Observable.throw(error);
  }
}
