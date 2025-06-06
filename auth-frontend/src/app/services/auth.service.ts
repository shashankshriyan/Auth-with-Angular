import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient, private router:Router) { }
  
  singUp(email:string, password:string){
    const body={email,password}
    return this.http.post(`${environment.apiUrl}/api/signup`,body);

  }

  logIn(email:string, password:string){
    const body={email,password}
    return this.http.post<{token:string}>(`${environment.apiUrl}/api/login`,body);
    
  }


  logOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(){
    return !!localStorage.getItem('token')
  }

  getToken(){
    return localStorage.getItem('token')
  }
}
