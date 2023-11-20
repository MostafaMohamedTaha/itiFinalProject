import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/core/home/home.component';
import { DepartmentComponent } from './components/core/department/department.component';
import { DepartmentDetailsComponent } from './components/core/department/department-details/department-details.component';
import { CartComponent } from './components/core/cart/cart.component';
import { ContactComponent } from './components/core/contact/contact.component';
import { OffersComponent } from './components/core/offers/offers.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NotFoundError } from 'rxjs';
import { ProductItemComponent } from './components/core/department/product-item/product-item.component';
import { OrdersComponent } from './components/core/orders/orders.component';
import { CheckoutComponent } from './components/core/checkout/checkout.component';
import { CheckoutSuccessComponent } from './components/core/checkout/checkout-success/checkout-success.component';
import { LocationComponent } from './components/core/contact/location/location.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '' },
  { path: 'products', component: DepartmentComponent },
  { path: 'products/details/:id', component: DepartmentDetailsComponent },
  { path: 'products/item', component: ProductItemComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'checkoutSucceed', component: CheckoutSuccessComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'offer', component: OffersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'location', component: LocationComponent },
  { path: '**', component: NotFoundError },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
