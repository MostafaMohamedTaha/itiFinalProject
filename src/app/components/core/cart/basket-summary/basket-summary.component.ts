import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IBasketItem } from '../../../models/basket';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent {
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

  //#region  child(item) to parent(basket) + - remove

  decrementItemQuantity(item: IBasketItem) {
    this.decrement.emit(item);
  }

  incrementItemQuantity(item: IBasketItem) {
    this.increment.emit(item);
  }

  removeBasketItem(item: IBasketItem) {
    this.remove.emit(item);
  }
  //#endregion

}