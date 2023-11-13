import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IBasket } from '../../models/basket';
import { Observable } from 'rxjs';
import { IUser } from '../../models/user';
import { BasketService } from '../../services/backet.service';
import { AccountService } from '../../services/account.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  //#region  dark

  @Input() darkMode: boolean = false;
  @Output() toggleDarkMode = new EventEmitter<void>();
  toggleDarkModeClicked() {
    this.toggleDarkMode.emit();
  }
  //#endregion

  //#region  translate
  constructor(private TranslateService: TranslateService, private basketService: BasketService, private accountService: AccountService) { }
  translate(event: any) {
    this.TranslateService.use(event.target.value)
  }
  //#endregion

  basket$!: Observable<IBasket | null>;
  currentUser$!: Observable<IUser | null>;


  ngOnInit(): void {
      this.basket$ = this.basketService.basket$;
      this.currentUser$ = this.accountService.currentUser$;
  }

  logout() {
    this.accountService.logout();
  }

}
