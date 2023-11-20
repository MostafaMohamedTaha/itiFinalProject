import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IOrder } from '../../../models/order';
import { BasketService } from 'src/app/components/services/backet.service';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent implements OnInit {
  order: IOrder | undefined;

  constructor(private router: Router,private backetService:BasketService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation && navigation.extras && navigation.extras.state;
    if (state) {
      this.order = state as IOrder;
    }
  }

  ngOnInit(): void {
  }
   handleSuccessfulPayment1(createdOrder: any) {
    this.backetService.deleteLocalBasket(createdOrder.basketId);
    const navigationExtras: NavigationExtras = { state: createdOrder };
    this.router.navigate(['products'], navigationExtras);
  }
}