//#region  default ng 
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//#endregion

//#region  shared components

import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
//#endregion

//#region  account
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
//#endregion

//#region  core component

import { HomeComponent } from './components/core/home/home.component';
import { DepartmentComponent } from './components/core/department/department.component';
import { DepartmentDetailsComponent } from './components/core/department/department-details/department-details.component';
import { CartComponent } from './components/core/cart/cart.component';
import { OffersComponent } from './components/core/offers/offers.component';
import { ContactComponent } from './components/core/contact/contact.component';
import { PagingHeaderComponent } from './components/core/paging-header/paging-header.component';
import { ProductItemComponent } from './components/core/department/product-item/product-item.component';
import { BasketSummaryComponent } from './components/core/cart/basket-summary/basket-summary.component';
import { OrderTotalsComponent } from './components/core/cart/order-totals/order-totals.component';

import { CheckoutComponent } from './components/core/checkout/checkout.component';
import { CheckoutAddressComponent } from './components/core/checkout/checkout-address/checkout-address.component';
import { CheckoutDeliveryComponent } from './components/core/checkout/checkout-delivery/checkout-delivery.component';
import { CheckoutPaymentComponent } from './components/core/checkout/checkout-payment/checkout-payment.component';
import { CheckoutReviewComponent } from './components/core/checkout/checkout-review/checkout-review.component';
import { CheckoutSuccessComponent } from './components/core/checkout/checkout-success/checkout-success.component';

//#endregion

//#region  icons
import { NgIconsModule } from '@ng-icons/core';
import { bootstrapCartCheckFill, bootstrapSunFill, bootstrapMoonStarsFill, bootstrapList, bootstrapTrash3Fill, bootstrapArrowLeftCircleFill, bootstrapArrowRightCircleFill, bootstrapCheckCircle, bootstrapCart3 } from '@ng-icons/bootstrap-icons';
//#endregion

//#region  form
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
//#endregion

//#region  pager
import { NgxPaginationModule } from 'ngx-pagination';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
//#endregion

//#region client mode
import { RequestInterceptor } from './components/core/interceptors/Request.interceptor';
import { TextInputComponent } from './components/auth/register/text-input/text-input.component';
//#endregion

//#region  translate function
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';


export function translateFactory(http: HttpClient) {
  return new TranslateHttpLoader(http)
}
//#endregion
//#region  pagination

import { CdkStepperModule } from '@angular/cdk/stepper';
import {BreadcrumbModule} from 'xng-breadcrumb';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { OrdersComponent } from './components/core/orders/orders.component';
import { StepperComponent } from './components/core/checkout/stepper/stepper.component';
import { RouterModule } from '@angular/router';
import { OrderDetailedComponent } from './components/core/orders/order-detailed/order-detailed.component';
import { cssSpinnerTwo } from '@ng-icons/css.gg';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationComponent } from './components/core/contact/location/location.component';
//#endregion
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DepartmentComponent,
    DepartmentDetailsComponent,
    CartComponent,
    SidebarComponent,
    FooterComponent,
    OffersComponent,
    ContactComponent,
    LoginComponent,
    RegisterComponent,
    PagingHeaderComponent,
    ProductItemComponent,
    TextInputComponent,
    BasketSummaryComponent,
    OrderTotalsComponent,
    CheckoutComponent,
    CheckoutAddressComponent,
    CheckoutDeliveryComponent,
    CheckoutPaymentComponent,
    CheckoutReviewComponent,
    CheckoutSuccessComponent,
    OrdersComponent,
    OrderDetailedComponent,
    StepperComponent,
    LocationComponent,
  ],
  imports: [
    //#region  default

    BrowserModule,
    AppRoutingModule,
    //#endregion

    //#region  form
    ReactiveFormsModule,
    FormsModule,
    //#endregion

    //#region pager

    NgxPaginationModule,
    MatPaginatorModule,
    MatTableModule,
    //#endregion

    //#region  icon

    NgIconsModule.withIcons({ bootstrapCartCheckFill, bootstrapSunFill, bootstrapMoonStarsFill, bootstrapList,bootstrapTrash3Fill,bootstrapArrowLeftCircleFill,bootstrapArrowRightCircleFill,bootstrapCheckCircle,cssSpinnerTwo,bootstrapCart3 }),
    //#endregion

    //#region client model
    HttpClientModule,
    //#endregion
    RouterModule,
    //#region  translate
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [HttpClient]
      }
    }),
    //#endregion
    CdkStepperModule,
    BreadcrumbModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
