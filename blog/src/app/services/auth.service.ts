import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

interface Token {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:3000/api'; 

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {}

  authenticate(credentials: any) {
    const localStorage = this.document.defaultView?.localStorage;
    
    return this.http.post<Token>(this.url + '/user/auth', {
      login: credentials.login,
      password: credentials.password
    }).pipe(
      map((result: any) => {
        if (result && result.token) {
          localStorage?.setItem('token', result.token);
          return true;
        }
        return false;
      })
    );
  }

  createOrUpdate(credentials: any) {
    return this.http.post(this.url + '/user/create', credentials);
  }

  login(credentials: any) {
    return this.authenticate(credentials);
  }

  register(credentials: any) {
    return this.createOrUpdate(credentials);
  }

  public getUser(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const decoded = new JwtHelperService().decodeToken(token);
    
    if (decoded) {
        return { 
            ...decoded, 
            id: decoded.userId || decoded.sub || decoded.id 
        };
    }
    return null;
  }

  logout() {
    const localStorage = this.document.defaultView?.localStorage;
    const userId = this.currentUser?.userId;

    if (userId) {
        return this.http.delete(this.url + '/user/logout/' + userId)
          .pipe(
            map(() => {
              localStorage?.removeItem('token');
            })
          );
    } else {
        localStorage?.removeItem('token');
        return this.http.delete(this.url + '/user/logout/unknown').pipe(map(() => {})); 
    }
  }

  isLoggedIn(): boolean {
    const localStorage = this.document.defaultView?.localStorage;
    const jwtHelper = new JwtHelperService();
    const token = localStorage?.getItem('token');
    
    if (!token) {
      return false;
    }
    return !jwtHelper.isTokenExpired(token);
  }

  get currentUser() {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    return new JwtHelperService().decodeToken(token);
  }

  getToken(): string | null {
    const localStorage = this.document.defaultView?.localStorage;
    return localStorage?.getItem('token') || null;
  }
}