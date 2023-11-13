import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../../models/basket';
import { BasketService } from '../../services/backet.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  //#region  params

  basket$!: Observable<IBasket | null>;
  basketTotals$!: Observable<IBasketTotals | null>;
  //#endregion

  //#region  ctor | init

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
    this.basketTotals$ = this.basketService.basketTotal$;
  }
  //#endregion

  
//#region  + - remove

removeBasketItem(item: IBasketItem) {
  this.basketService.removeItemFromBasket(item);
}

incrementItemQuantity(item: IBasketItem) {
  this.basketService.incrementItemQuantity(item);
}

decrementItemQuantity(item: IBasketItem) {
  this.basketService.decrementItemQuantity(item);
}
//#endregion
}
