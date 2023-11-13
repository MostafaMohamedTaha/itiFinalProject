import { Component, ElementRef, OnInit, Type, ViewChild } from '@angular/core';
import { IBrand } from '../../models/brand';
import { IProduct } from '../../models/product';
import { IType } from '../../models/productType';
import { ShopParams } from '../../models/shopParams';
import { ShopService } from '../../services/shop.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  
  //#region params
  @ViewChild('search', { static: false }) searchTerm!: ElementRef;
  public sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to high', value: 'priceAsc' },
    { name: 'Price: High to low', value: 'priceDesc' },
  ];
  public products: IProduct[] = [];
  public brands: IBrand[] = [{ id: 0, name: 'All' }];
  public types: IType[] = [{ id: 0, name: 'All' }];

  public shopParams: ShopParams;
  public totalCount: number = 0;

  private brandsSubscription: Subscription | undefined;
  private typesSubscription: Subscription | undefined;
  //#endregion
  
  //#region  ctor init

  constructor(private shopService: ShopService) {
    this.shopParams = this.shopService.getShopParams();
  }

  ngOnInit(): void {
    this.getProducts(true);
    this.getBrands();
    this.getTypes();
  }
  //#endregion
  
  //#region  get data

  getProducts(useCache = false) {
    this.shopService.getProducts(useCache).subscribe({
      next: (response) => {
        this.products = response.data;
        this.totalCount = response.count;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getBrands() {
    this.brandsSubscription = this.shopService.getBrands().subscribe(
      (response: IBrand[]) => {
        if (Array.isArray(response)) {
          this.brands = response; // Replace the entire array with the new data
        } else {
          console.error("Invalid API response format: data is not an array");
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getTypes() {
    this.typesSubscription = this.shopService.getTypes().subscribe(
      (response: IType[]) => {
        if (Array.isArray(response)) {
          this.types = response; // Replace the entire array with the new data
        } else {
          console.error("Invalid API response format: data is not an array");
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  ngOnDestroy() {
    if (this.typesSubscription) {
      this.typesSubscription.unsubscribe();
    }
    if (this.brandsSubscription) {
      this.brandsSubscription.unsubscribe();
    }
  }

  //#endregion

  //#region  filter

  onBrandSelected(brandId: number) {

    this.updateShopParams(params => {
      params.brandId = brandId;
      params.pageNumber = 1;
    });
  }

  onTypeSelected(typeId: number) {
    this.updateShopParams(params => {
      params.typeId = typeId;
      params.pageNumber = 1;
    });
  }

  onSortSelected(event: any) {
    const sort = event.target.value;
    const params = this.shopService.getShopParams();
    params.sort = sort;
    this.shopService.setShopParams(params);
    this.getProducts();
  }
  //#endregion
  
  //#region  change

  onPageChanged(event: number) {
    this.updateShopParams(params => {
      if (params.pageNumber !== event) {
        params.pageNumber = event;
        this.getProducts(true);
      }
    });
  }

  onSearch() {
    this.updateShopParams(params => {
      params.search = this.searchTerm.nativeElement.value;
      params.pageNumber = 1;
    });
  }

  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }
  //#endregion

  //#region  update

  private updateShopParams(updateFn: (params: ShopParams) => void) {
    const params = this.shopService.getShopParams(); // Clone the object
    updateFn(params);
    this.shopService.setShopParams(params);
    this.getProducts();
  }
  //#endregion

}
