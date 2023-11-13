import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../services/account.service';
import { IAddress } from '../../../models/address';
import { catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent {
  @Input() checkoutForm!: FormGroup;

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  //#region  save address

  saveUserAddress() {

    const addressFormValue = this.checkoutForm.get('addressForm')?.value;

    if (addressFormValue) {
      this.accountService.updateUserAddress(addressFormValue).pipe(
        switchMap((address: IAddress) => {
          this.toastr.success('Address saved');
          this.checkoutForm.get('addressForm')?.reset(address);
          return of(address);
        }),
        catchError((error: any) => {
          this.toastr.error(error.message);
          return of(null);
        })
      ).subscribe();
    }

  }
  //#endregion
}
