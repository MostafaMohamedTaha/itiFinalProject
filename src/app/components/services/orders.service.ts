import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  //#region  end point param

  baseUrl = environment.apiUrl;
  //#endregion
  
  //#region  ctor

  constructor(private http: HttpClient) { }
  //#endregion

  //#region  order |order details

  getOrdersForUser() {
    return this.http.get(this.baseUrl + 'Orders');
  }

  getOrderDetailed(id: number) {
    return this.http.get(this.baseUrl + 'Orders/' + id);
  }
  //#endregion
}