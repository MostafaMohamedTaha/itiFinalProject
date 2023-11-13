import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-totals',
  templateUrl: './order-totals.component.html',
  styleUrls: ['./order-totals.component.scss']
})
export class OrderTotalsComponent implements OnInit {
  
  @Input() shippingPrice: number | undefined;
  @Input() subtotal: number | undefined;
  @Input() total: number | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}