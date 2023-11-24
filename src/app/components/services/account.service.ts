import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAddress } from '../models/address';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  //#region  params

  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  //#endregion

  //#region  ctor 
  constructor(private http: HttpClient, private router: Router) { }
  //#endregion
  
  //#region  user service
  loadStoredUser(): Observable<IUser | null> {
    const storedToken = localStorage.getItem('token');
  
    if (!storedToken) {
      this.currentUserSource.next(null);
      return of(null);
    }
  
    return this.loadCurrentUser(storedToken);
  }
  loadCurrentUser(token: string): Observable<IUser | null> {
    if (!token) {
      this.currentUserSource.next(null);
      return of(null);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<IUser>(this.baseUrl + 'account', { headers }).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          return user; // Return the user object
        } else {
          this.currentUserSource.next(null);
          return null; // Return null explicitly
        }
      }),
      catchError(error => {
        console.error('Error loading current user:', error);
        this.currentUserSource.next(null);
        return of(null);
      })
    );
  }

  login(values: any): Observable<IUser | null> {
    return this.http.post<IUser>(this.baseUrl + 'Account/login', values).pipe(
      tap((user: IUser | null) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        } else {
          this.currentUserSource.next(null);
        }
      }),
      catchError(error => {
        console.error('Error during login:', error);
        this.currentUserSource.next(null);
        return of(null);
      })
    );
  }
  

  register(values: any): Observable<IUser | null> {
    return this.http.post<IUser>(this.baseUrl + 'Account/register', values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          return user; // Return the user object
        }
        this.currentUserSource.next(null);
        return null; // Return null explicitly
      }),
      catchError(error => {
        console.error('Error during login:', error);
        this.currentUserSource.next(null);
        return of(null);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'Account/emailexists?email=' + email);
  }
  //#endregion

  //#region  user Address

  getUserAddress() {
    return this.http.get<IAddress>(this.baseUrl + 'Account/address');
  }

  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(this.baseUrl + 'Account/address', address);
  }
  //#endregion
}
