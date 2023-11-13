import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BasketService } from '../../../services/backet.service';
import { IBasket } from '../../../models/basket';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit {
  @Input() appStepper!: CdkStepper;
  basket$!: Observable<IBasket | null>;

  constructor(private basketService: BasketService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
    if (!this.appStepper) {
      this.toastr.error('Error: appStepper is not defined.');
    }
  }

  createPaymentIntent() {
    this.basketService.createPaymentIntent().subscribe(
      (response: any) => {
        if (this.appStepper) {
          this.appStepper.next();
        } else {
          this.toastr.error('Error: appStepper is not defined.');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
