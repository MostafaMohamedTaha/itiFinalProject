import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IDeliveryMethod } from '../models/deliveryMethod';
import { IOrderToCreate } from '../models/order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  //#region  end point param

  baseUrl = environment.apiUrl;
  //#endregion

  //#region  ctor

  constructor(private http: HttpClient) { }
  //#endregion

  //#region  message 

  createOrder(order: IOrderToCreate) {
    return this.http.post(this.baseUrl + 'orders', order);
  }

  getDeliveryMethods(): Observable<IDeliveryMethod[]> {
    return this.http.get<IDeliveryMethod[]>(this.baseUrl + 'Orders/deliveryMethods').pipe(
      map((dm: IDeliveryMethod[]) => dm.sort((a, b) => b.cost - a.cost))
    );
  }
  //#endregion
}
