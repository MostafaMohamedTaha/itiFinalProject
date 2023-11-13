import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError, switchMap, take } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { BasketService } from '../../services/backet.service';
import { IBasketTotals } from '../../models/basket';
import { IAddress } from '../../models/address';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  @Input() checkoutForm!: FormGroup;
  basketTotals$!: Observable<IBasketTotals | null>;
  toastr: any;

  constructor(private fb: FormBuilder, private accountService: AccountService, private basketService: BasketService) { }

  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddressFormValues();
    this.getDeliveryMethodValue();

    this.basketTotals$ = this.basketService.basketTotal$;
  }
  //#region  create forms of all pages

  createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        country: [null, Validators.required],
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required]
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required]
      })
    })
  }
  //#endregion

  //#region  get address

  getAddressFormValues() {
    if (this.checkoutForm) {
      this.checkoutForm.get('addressForm')?.valueChanges
        .pipe(
          switchMap(() => this.accountService.getUserAddress()),
          catchError((error: any) => {
            this.toastr.error(error.message);
            console.error(error);
            throw error; // Re-throw the error to propagate it to the subscriber
          })
        )
        .subscribe(
          (address: IAddress) => {
            this.toastr.success('Address saved');
            this.checkoutForm.get('addressForm')?.reset(address);
          }
        );
    }
  }
  //#endregion

  //#region  get delivery methods

  getDeliveryMethodValue() {
    const basket = this.basketService.getCurrentBasketValue();
    if (basket?.deliveryMethodId !== null) {
      const deliveryForm = this.checkoutForm.get('deliveryForm');
      if (deliveryForm) {
        const deliveryMethodControl = deliveryForm.get('deliveryMethod');
        if (deliveryMethodControl) {
          deliveryMethodControl.patchValue(basket?.deliveryMethodId?.toString());
        }
      }
    }
  }
  //#endregion

}