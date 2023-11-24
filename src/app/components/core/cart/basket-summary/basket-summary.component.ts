import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBasketItem } from '../../../models/basket';
import { ShopService } from 'src/app/components/services/shop.service';
import { IProduct } from 'src/app/components/models/product';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit{
  //#region  param child(item) to parent(basket)

  @Output() decrement: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() increment: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  //#endregion

  //#region  params void

  @Input() isBasket = true;
  @Input() isOrder = false;
  @Input() items: IBasketItem[] = [];
  //#endregion
/**
 *
 */
constructor(private shopService:ShopService) {}
  ngOnInit(): void {


  }
  //#region  child(item) to parent(basket) + - remove

  decrementItemQuantity(item: IBasketItem) {
    this.decrement.emit(item);
  }
  productQuantity: number  =0;
  incrementItemQuantity(item: IBasketItem) {
    this.shopService.getProduct(item.id).subscribe(
      x => {
        this.productQuantity =x.quantity as number
      }, 
      error => {
        console.error('Error:', error);
      }
    );
    this.increment.emit(item);
  }

  removeBasketItem(item: IBasketItem) {
    this.remove.emit(item);
  }
  //#endregion

}