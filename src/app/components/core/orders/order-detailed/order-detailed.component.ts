import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from '../../../models/order';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../../../services/orders.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss']
})
export class OrderDetailedComponent implements OnInit {
  order!: IOrder ;
  private routeSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private orderService: OrdersService
  ) {
    this.breadcrumbService.set('@OrderDetailed', ' ');
  }

  ngOnInit(): void {
    this.routeSubscription = this.route?.paramMap?.subscribe((params:any) => {
      if (params) {
        const orderId = +params.get('id');

        if (!isNaN(orderId)) {
          this.orderService.getOrderDetailed(orderId).subscribe(
            (order: any) => {
              this.order = order as IOrder;
              this.breadcrumbService.set('@OrderDetailed', `Order# ${order.id} - ${order.status}`);
            },
            (error) => {
              console.log(error);
            }
          );
        } else {
          console.error('Invalid order ID provided in the route.');
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }}
