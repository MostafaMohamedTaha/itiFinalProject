import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap, finalize } from 'rxjs/operators';
import { IUser } from '../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  returnUrl!: string;
  errors!: string[];

  constructor(
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.accountService.loadStoredUser().subscribe(
      () => {
        this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/products';
        this.createLoginForm();
      },
      error => {
        console.error('Error loading stored user:', error);
      }
    );
  }

  createLoginForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'),
      ]),
    });
  }

  // public navigateToUrl:boolean = false;
  // onSubmit(): void {

  //   if (this.loginForm.valid && this.returnUrl) {
  //     const { email, password } = this.loginForm.value;

  //     this.accountService.login({ email, password })
  //       .pipe(
  //         tap((user: IUser | null) => {
  //           // Successful login, set the flag to navigate
  //           this.navigateToUrl = !!user; // Set to true if user is not null
  //         }),
  //         catchError((error) => {
  //           console.error(error);

  //           if (error.status === 401) {
  //             // Unauthorized (wrong password)
  //             this.loginForm.setErrors({ wrongPassword: true });
  //           }

  //           throw error; // Re-throw the error after handling
  //         }),
  //         finalize(() => {
  //           // This block will execute after the observable completes (whether successfully or with an error)
  //           console.log('Finalize block executed. Navigate to URL:', this.navigateToUrl);

  //           if (this.navigateToUrl) {
  //             this.router.navigateByUrl(this.returnUrl);
  //           }
  //         })
  //       )
  //       .subscribe();
  //   }
  // }
  public wrongPasswordError: boolean = false;
  public navigateToUrl:boolean = false;
  onSubmit(): void {
    if (this.loginForm.valid && this.returnUrl) {
      const { email, password } = this.loginForm.value;
  
      this.accountService.login({ email, password })
        .pipe(
          tap((user: IUser | null) => {
            // Successful login, set the flag to navigate
            this.navigateToUrl = !!user;
            this.wrongPasswordError = false; // Reset the error flag
          }),
          catchError((error) => {
            console.error(error);
  
            if (error.status === 401) {
              // Unauthorized (wrong password)
              this.loginForm.setErrors({ wrongPassword: true });
              this.wrongPasswordError = true; // Set the error flag
            }
  
            throw error;
          }),
          finalize(() => {
            // This block will execute after the observable completes (whether successfully or with an error)
            console.log('Finalize block executed. Navigate to URL:', this.navigateToUrl);
  
            if (this.navigateToUrl) {
              this.router.navigateByUrl(this.returnUrl);
            }
          })
        )
        .subscribe();
    }
  }
  
  





}
