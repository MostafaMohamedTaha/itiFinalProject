import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from '../../../services/backet.service';
import { IDeliveryMethod } from '../../../models/deliveryMethod';
import { CheckoutService } from '../../../services/checkout.service';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {
  @Input() checkoutForm!: FormGroup;
  deliveryMethods: IDeliveryMethod[] = [];

  constructor(private checkoutService: CheckoutService, private basketService: BasketService) { }

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().pipe(
      tap((dm: IDeliveryMethod[]) => {
        this.deliveryMethods = dm;
      }),
      catchError((error: any) => {
        console.error(error);
        return [];
      })
    ).subscribe();
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.basketService.setShippingPrice(deliveryMethod);
  }
}
