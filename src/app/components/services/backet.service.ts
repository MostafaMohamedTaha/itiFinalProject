import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../models/basket';
import { IDeliveryMethod } from '../models/deliveryMethod';
import { IProduct } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  //#region  params

  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket | null>(null);
  private basketTotalSource = new BehaviorSubject<IBasketTotals | null>(null);

  basket$ = this.basketSource.asObservable();
  basketTotal$ = this.basketTotalSource.asObservable();
  shipping: number | undefined = 0;

  constructor(private http: HttpClient) {
    this.basketSource.next(this.createBasket());
  }
  //#endregion

  //#region  payment

  createPaymentIntent(): Observable<unknown> {
    return this.http.post<IBasket>(this.baseUrl + 'payments/' + this.getCurrentBasketValue()?.id, {})
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
          console.log(this.getCurrentBasketValue());
        }),
        catchError((error) => {
          console.error('Error creating payment intent:', error);
          return this.handleCreatePaymentError(error);
        })
      );
  }
  handleCreatePaymentError(error: any): any {
    throw new Error('Method not implemented.');
  }
  //#endregion

  //#region  ship delivery

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.cost;
    const basket = this.getCurrentBasketValue();
    if (basket) {
      basket.deliveryMethodId = deliveryMethod.id;
      basket.shippingPrice = deliveryMethod.cost;
      this.calculateTotals();
      this.setBasket(basket);
    }
  }
  //#endregion

  //#region  set |get basket

  getBasket(id: string) {
    return this.http.get<IBasket>(this.baseUrl + 'Basket?id=' + id)
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
          if (this.shipping !== undefined && (this.shipping as number) > 0) {
            this.shipping = basket.shippingPrice;
            this.calculateTotals();
          }
          return basket;
        }),
        catchError((error) => {
          console.error('Error loading basket:', error);
          return this.handleGetBasketError(error);
        })
      );
  }
  private handleGetBasketError(error: any): Observable<IBasket | null> {
    // Handle the error here, e.g., display an error message or perform other actions.
    // Return an observable with a value, or throw an error, depending on your needs.
    return new BehaviorSubject<IBasket | null>(null);
  }
  setBasket(basket: IBasket) {
    return this.http.post<IBasket>(this.baseUrl + 'Basket', basket).pipe(
      map((response: IBasket) => {
        this.basketSource.next(response);
        this.calculateTotals();
        return response;
      })
    );
  }
  //#endregion

  //#region  get basket current value

  getCurrentBasketValue() {
    return this.basketSource.value;
  }
  //#endregion

  //#region  add to basket

  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() || this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket).subscribe();
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
      basket.items[foundItemIndex].quantity++;
      this.setBasket(basket).subscribe();
    }
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
      if (basket.items[foundItemIndex].quantity > 1) {
        basket.items[foundItemIndex].quantity--;
        this.setBasket(basket).subscribe();
      } else {
        this.removeItemFromBasket(item);
      }
    }
  }
  //#endregion

  //#region  remove basket

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      if (basket.items.some(x => x.id === item.id)) {
        basket.items = basket.items.filter(i => i.id !== item.id);
        if (basket.items.length > 0) {
          this.setBasket(basket).subscribe();
        } else {
          this.deleteBasket(basket);
        }
      }
    }
  }

  deleteLocalBasket(id: string) {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).pipe(
      map(() => {
        this.basketSource.next(null);
        this.basketTotalSource.next(null);
        localStorage.removeItem('basket_id');
      })
    );
  }
  //#endregion

  //#region  calc total

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      const shipping = this.shipping as number;
      const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
      if (shipping >= 0) {
        const total = subtotal + shipping;
        this.basketTotalSource.next({ shipping, total, subtotal });
      }
    }
  }
  //#endregion

  //#region  add or update items

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }
  //#endregion

  //#region  map items

  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    };
  }
  //#endregion

  
  //#region update quantity 
  updateQuantityInDatabase(basket: IBasket): Observable<IBasket> {
    const endpoint = `${this.baseUrl}Basket/updateQuantity`; // Replace with your actual update endpoint
    return this.http.post<IBasket>(endpoint, basket).pipe(
      map((response: IBasket) => {
        this.basketSource.next(response);
        this.calculateTotals();
        return response;
      }),
      catchError((error) => {
        console.error('Error updating quantity in the database:', error);
        // Handle the error appropriately, e.g., display an error message
        throw error;
      })
    );
  }
  //#endregion
  
  //#region quantity enough 
  isQuantityEnough(basket: IBasket | null): Observable<boolean> {
    if (!basket) {
      return new Observable<boolean>(observer => observer.next(false));
    }

    const endpoint = `${this.baseUrl}Basket/isQuantityEnough`; // Replace with your actual endpoint
    return this.http.post<boolean>(endpoint, basket).pipe(
      catchError((error) => {
        console.error('Error checking if quantity is enough:', error);
        // Handle the error appropriately, e.g., display an error message
        throw error;
      })
    );
  }
  //#endregion

  //#region  create basket

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }
  //#endregion
}



