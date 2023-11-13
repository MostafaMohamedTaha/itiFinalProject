import { Component, OnInit } from '@angular/core';
import { IOrder } from '../../models/order';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: IOrder[] = [];

  constructor(private orderService: OrdersService) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.orderService.getOrdersForUser().subscribe(
      (response: any) => {
        // Cast the response to the expected type
        this.orders = response as IOrder[];
      },
      (error) => {
        console.error('Error fetching orders:', error);
        // Optionally, you can show a user-friendly error message or log the error in a service
      }
    );
  }
}