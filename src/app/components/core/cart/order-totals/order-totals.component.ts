// order-totals.component.ts

import { BasketService } from 'src/app/components/services/backet.service';
import { Basket, IBasket } from './../../../models/basket';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscribable } from 'rxjs';

@Component({
  selector: 'app-order-totals',
  templateUrl: './order-totals.component.html',
  styleUrls: ['./order-totals.component.scss']
})
export class OrderTotalsComponent implements OnInit {

  @Input() shippingPrice: number | undefined;
  @Input() subtotal: number | undefined;
  @Input() total: number | undefined;
  @Input() basket$!: Observable<IBasket | null>;

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
  }

  proceedToCheckout() {
    const basket = this.basketService.getCurrentBasketValue();
    const isQuantityEnough = this.basketService.isQuantityEnough(basket);
    // if (isQuantityEnough) {

      
      this.basketService.updateQuantityInDatabase(basket as IBasket).subscribe(
        (response) => {
          // Handle the response if needed
          console.log(response);
        },
        (error) => {
          // Handle the error
          console.error(error);
        }
      );
    // }
  }

  // isQuantityEnough(basket: Basket | null): boolean {
  //   // Add your logic to check if the quantity is enough

  //   // You may compare the quantity in the basket with some threshold or other criteria
  //   return true; // Change this based on your actual logic
  // }

  updateQuantityInDatabase(basket: Basket | null) {
    // Add your logic to update the quantity in the database
    // Make the quantity equal to the available quantity in the database

    // Assuming you have a function to update the quantity
    if (basket) {
      this.basketService.updateQuantityInDatabase(basket).subscribe(() => {
        // Show a message indicating the available quantity
        console.log('Quantity updated in the database. Available quantity: ', basket?.items[0].quantity);
      });
    }
  }
}
