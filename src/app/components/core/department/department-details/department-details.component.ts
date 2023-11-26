import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/components/models/product';
import { BasketService } from 'src/app/components/services/backet.service';
import { ShopService } from 'src/app/components/services/shop.service';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrls: ['./department-details.component.scss']
})
export class DepartmentDetailsComponent {
  //#region  params

  product!: IProduct;
  quantity: number = 1;
  //#endregion

  //#region  ctor

  constructor(private shopService: ShopService,
    private activatedRoute: ActivatedRoute,
    private bcService: BreadcrumbService,
    private basketService: BasketService) {
    this.bcService.set('@productDetails', ' ')
  }
  //#endregion 

  //#region init

  ngOnInit(): void {
    this.loadProduct();
  }
  //#endregion
  
  //#region  load product

  
  loadProduct() {
    if (!this.product) {
      const idParam = this.activatedRoute.snapshot.paramMap.get('id');
      
      if (idParam) {
        const productId = +idParam;
        
        this.shopService.getProduct(productId).subscribe(
          (product) => {
            this.product = product;
            this.bcService.set('@productDetails', product.name);
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        console.log('No product ID parameter found in the route.');
      }
    }
  }
  //#endregion

  //#region  products

  addItemToBasket() {
    this.basketService.addItemToBasket(this.product, this.quantity);
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  //#endregion

}
