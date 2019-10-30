import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UsersService } from '@app/shared/api';
import { Observable, of, throwError } from 'rxjs';

export const credentialsKey = 'user';

@Injectable()
export class AuthenticationService {
  private _credentials: any | null;

  constructor(public authService: AuthService, public usersService: UsersService) {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  login(context: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.authService.doLogin(context).then(
        res => {
          const data = {
            [credentialsKey]: res.user.uid,
            email: context.email
          };
          this.usersService.get(data[credentialsKey]).subscribe((response: any) => {
            if (response['id']) {
              this.setCredentials(response);
            }
          });
          this.setCredentials(data);
          resolve(data);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  register(context: any, noLogin?: boolean): Promise<any> {
    const user: any = {
      name: context.name,
      mobilenumber: context.phone,
      password: context.password,
      email: context.email
    };

    return new Promise<any>((resolve, reject) => {
      this.usersService.create(user).subscribe((response: any) => {
        if (response['uid']) {
          if (!noLogin) {
            user[credentialsKey] = response['uid'];
            this.setCredentials(user);
            this.authService.doLogin(user);
          }
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  }

  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.authService.doLogout();
    this.setCredentials();
    return of(true);
  }

  isAuthenticated(): boolean {
    if (!!this.credentials) {
      this.authService.isLogged().then(
        res => { },
        err => {
          this.logout();
        }
      );
    }
    return !!this.credentials;
  }

  isAuthenticatedAdmin(ifFalse?: Function): Promise<boolean> {
    if (!!this.credentials) {
      return this.authService.isLogged().then(
        res => {
          console.log(this._credentials);
          if (this._credentials['type'] === 'admin') {
            return true;
          } else {
            ifFalse();
            return false;
          }
        },
        err => {
          this.logout();
          ifFalse();
          return false;
        }
      );
    } else {
      // return this._credentials.usertype === "admin";
      ifFalse();
      return new Promise((res, reject) => res(false));
    }
  }

  get credentials(): any | null {
    const r = this._credentials;
    if (r && r['password']) {
      delete r['password'];
    }
    if (r && r['id']) {
      r[credentialsKey] = r['id'];
      delete r['id'];
    }
    if (r && typeof r === 'object' && !r.image) {
      r.image = 'https://auction-app-843e9.firebaseapp.com/assets/images/user-photo-50x50.jpg';
    }
    return this._credentials;
  }

  get user(): object {
    if (!this.isAuthenticated()) {
      return {};
    } return {
      id: this._credentials[credentialsKey],
      name: this._credentials.name,
      image: this._credentials.image,
      email: this._credentials.email
    };
  }

  private setCredentials(credentials?: any) {
    if (credentials && credentials['timestamp']) {
      delete credentials['timestamp'];
    }

    this._credentials = credentials || null;
    if (credentials) {
      localStorage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      localStorage.removeItem(credentialsKey);
      localStorage.removeItem('_token');
      this._credentials = null;
    }
  }
}
