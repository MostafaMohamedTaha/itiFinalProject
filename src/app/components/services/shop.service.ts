import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from '../models/brand';
import { IPagination, Pagination } from '../models/pagination';
import { IType } from '../models/productType';
import { catchError, map } from 'rxjs/operators';
import { ShopParams } from '../models/shopParams';
import { IProduct } from '../models/product';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  //#region  params
  baseUrl = environment.apiUrl;

  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];

  private pagination = new Pagination();

  private productCache = new Map();

  shopParams = new ShopParams();
  //#endregion

  //#region  ctor

  constructor(private http: HttpClient) { }
  //#endregion

  //#region  params build
  public buildHttpParams(): HttpParams {
    let params = new HttpParams();

    if (this.shopParams.brandId !== 0) {
      params = params.append('BrandId', this.shopParams.brandId.toString());
    }

    if (this.shopParams.typeId !== 0) {
      params = params.append('TypeId', this.shopParams.typeId.toString());
    }

    if (this.shopParams.search) {
      params = params.append('Search', this.shopParams.search);
    }

    params = params.append('Sort', this.shopParams.sort);
    params = params.append('PageIndex', this.shopParams.pageNumber.toString());
    params = params.append('PageSize', this.shopParams.pageSize.toString());

    return params;
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams() {
    return this.shopParams;
  }
  //#endregion

  //#region  get product

  getProducts(useCache: boolean): Observable<IPagination> {
    if (!useCache) {
      this.productCache.clear();
    }

    const cacheKey = Object.values(this.shopParams).join('-');
    if (this.productCache.has(cacheKey)) {
      return of(this.productCache.get(cacheKey) as IPagination);
    }

    const params = this.buildHttpParams();
    return this.http.get<IPagination>(`${this.baseUrl}products`, { observe: 'response', params })
      .pipe(
        map(response => {
          if (response.body) {
            this.pagination = response.body;
            return this.pagination;
          }
          return new Pagination(); // Return a new instance of Pagination in case of no response body
        })
      );
  }
  //#endregion

  //#region product by id

  getProduct(id: number): Observable<IProduct> {
    const cachedProduct = this.productCache.get(id);

    if (cachedProduct) {
      return of(cachedProduct);
    }

    return this.http.get<IProduct>(`${this.baseUrl}Products/id?id=${id}`).pipe(
      map(product => {
        this.productCache.set(id, product);
        return product;
      })
    );
  }
  //#endregion

  getProductQuantityById(id: number): Observable<IProduct> {
    const url = `${this.baseUrl}Products/quantity?id=${id}`;

    return this.http.get<IProduct>(url).pipe(
      map(response => {
        console.log("r"+ response)
        return response;
      }),
      catchError(error => {
        console.error('Error getting product quantity:', error);
        return throwError(error);
      })
    );
  }




  //#region  get brand

  getBrands() {
    if (this.brands.length > 0) {
      return of(this.brands);
    }

    return this.http.get(this.baseUrl + 'Products/brands').pipe(
      map((response: any) => {
        this.brands = response;
        return response
      }),
      catchError((error: any) => {
        console.error('Error fetching product brands:', error);
        return throwError(error); // Rethrow the error
      })
    );
  }
  //#endregion

  //#region  get type

  getTypes() {
    if (this.types.length > 0) {
      return of(this.types);
    }

    return this.http.get<IType[]>(this.baseUrl + 'Products/types').pipe(
      map((response: any) => {
        this.types = response;
        return response;
      }),
      catchError((error: any) => {
        console.error('Error fetching product brands:', error);
        return throwError(error); // Rethrow the error
      })
    );
  }
  //#endregion

}