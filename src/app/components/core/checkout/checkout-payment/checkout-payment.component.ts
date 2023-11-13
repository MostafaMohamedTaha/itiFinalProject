import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from '../../../services/backet.service'; // Corrected typo in the import statement
import { CheckoutService } from '../../../services/checkout.service';
import { IBasket } from '../../../models/basket';
import { loadStripe, StripeElements } from '@stripe/stripe-js'; // Removed unused import
import { lastValueFrom } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
  ]
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm!: FormGroup;
  //#region  get value from input

  //inheritance all data of card number and save it in cardNumberElement : type(element ref)
  @ViewChild('cardNumber', { static: true }) cardNumberElement!: ElementRef;
  @ViewChild('cardExpiry', { static: true }) cardExpiryElement!: ElementRef;
  @ViewChild('cardCvc', { static: true }) cardCvcElement!: ElementRef;
  //#endregion

  //#region  stripe params

  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardNumberValid = false;
  cardExpiryValid = false;
  cardCvcValid = false;
  cardErrors: any;
  //#endregion

  //#region  stripe declare

  stripe: any;
  private elements!: StripeElements;
  loading = false;
  //#endregion

  //#region  ctor

  constructor(
    private backetService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router,
  ) { }
  //#endregion

  //#region  after child view inherit |destroy

  ngAfterViewInit(): void {
    this.initializeStripe();
    setTimeout(() => {
    this.setupCardElement('cardNumber', this.cardNumberElement.nativeElement);
    this.setupCardElement('cardExpiry', this.cardExpiryElement.nativeElement);
    this.setupCardElement('cardCvc', this.cardCvcElement.nativeElement);
  },2000)
}

  ngOnDestroy(): void {
    this.destroyCardElements();
  }
  //#endregion

  //#region  initial stripe key |load | array elements

  private async initializeStripe() {
    const stripePublicKey = 'pk_test_51OAtNgKjIrDgg9BWZKuLYtXyhQ4sfk6r9sOd9Y8mnZ8eKUHATGg04eubfam9YW7FbeNCAwlBQs76POwL9XfqtZPt00fz5qw5hS';

    try {
      this.stripe = await loadStripe(stripePublicKey);
      this.elements = this.stripe.elements();
      console.log('Stripe initialized successfully');
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      // Handle the error as needed, such as showing a user-friendly message or logging it.
    }
  }
  //#endregion

  //!#region  create card n e c

  private setupCardElement(type: string, element: HTMLElement): void {
    if (!this.elements) {
      throw new Error('Stripe elements not initialized. Call initializeStripe() before using setupCardElement.');
    }
    let cardElement: any;

    switch (type) {
      case 'cardNumber':
        cardElement = this.elements.create('cardNumber');
        break;
      case 'cardExpiry':
        cardElement = this.elements.create('cardExpiry');
        break;
      case 'cardCvc':
        cardElement = this.elements.create('cardCvc');
        break;
      default:
        throw new Error(`Invalid card element type: ${type}`);
    }

    cardElement.mount(element);

    // Use 'on' method for event handling
    cardElement.on('change', (event: any) => {
      this.onChange(event);
    });
  }
  //#endregion

  //#region  destroy card data

  private destroyCardElements(): void {
    this.destroyCardElement(this.cardNumber);
    this.destroyCardElement(this.cardExpiry);
    this.destroyCardElement(this.cardCvc);
  }

  private destroyCardElement(cardElement: any): void {
    if (cardElement) {
      cardElement.destroy();
    }
  }
  //#endregion

  //#region  validate card

  onChange(event: { error: { message: any }; elementType: any; complete: boolean }): void {
    this.updateCardErrors(event.error);
    this.updateCardValidation(event.elementType, event.complete);
  }

  private updateCardErrors(error: { message: any }): void {
    this.cardErrors = error ? error.message : null;
  }

  private updateCardValidation(elementType: string, complete: boolean): void {
    switch (elementType) {
      case 'cardNumber':
        this.cardNumberValid = complete;
        break;
      case 'cardExpiry':
        this.cardExpiryValid = complete;
        break;
      case 'cardCvc':
        this.cardCvcValid = complete;
        break;
    }
  }
  //#endregion

  //#region  submit order

  async submitOrder(): Promise<void> {
    this.loading = true;
    try {
      const basket = this.backetService.getCurrentBasketValue();
      if (basket) {
        const createdOrder = await this.createOrder(basket);
        const paymentResult = await this.confirmPaymentWithStripe(basket, this.getCardName());

        this.handlePaymentResult(paymentResult, createdOrder);
      }
    } catch (error) {
      this.handleErrorDuringPayment();
      console.log(error)
    } finally {
      this.loading = false;
    }
  }
  //#endregion

  //#region  get card name

  private getCardName(): string {
    return this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.value || '';
  }
  //#endregion

  //#region  confirm payment

  private async confirmPaymentWithStripe(basket: IBasket, nameOnCard: string) {
    try {
      const result = await this.stripe.confirmCardPayment(basket.clientSecret, {
        payment_method: {
          card: this.cardNumber,
          billing_details: {
            name: nameOnCard
          }
        }, catch(error: any) {
          console.error('Error confirming payment with Stripe:', error);
          throw new Error('Error confirming payment with Stripe');
        }

      });

      if (result.paymentIntent) {
        return { paymentIntent: result.paymentIntent };
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      throw new Error('Error confirming payment with Stripe');
    }
  }
  //#endregion

  //#region  create order

  private async createOrder(basket: IBasket) {
    const orderToCreate = this.getOrderToCreate(basket);
    return lastValueFrom(this.checkoutService.createOrder(orderToCreate));
  }

  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm')?.get('deliveryMethod')?.value,
      shipToAddress: this.checkoutForm.get('addressForm')?.value
    };
  }
  //#endregion

  //#region  handle payment succeed |fail |during
  private handlePaymentResult(paymentResult: { paymentIntent: any }, createdOrder: any) {
    if (paymentResult.paymentIntent) {
      this.handleSuccessfulPayment(createdOrder);
    } else {
      this.handleFailedPayment(paymentResult.paymentIntent);
    }
  }

  private handleSuccessfulPayment(createdOrder: any) {
    this.backetService.deleteLocalBasket(createdOrder.basketId);
    const navigationExtras: NavigationExtras = { state: createdOrder };
    this.router.navigate(['checkoutSucceed'], navigationExtras);
  }

  private handleFailedPayment(paymentIntent: any) {
    this.toastr.error(paymentIntent);
  }

  private handleErrorDuringPayment() {
    console.error('An error occurred during the payment process.');
    this.toastr.error('An error occurred during the payment process.');
  }
  //#endregion
}


//#endregion