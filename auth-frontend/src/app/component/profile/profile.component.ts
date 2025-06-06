import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  userData:any=null;
  errorMessage='';

  constructor(private authService:AuthService,private http:HttpClient){}

  ngOnInit(): void {
    
    
      this.http.get(environment.apiUrl+'/api/profile').subscribe({
        next:(response:any)=>{
          this.userData=response;
          
          


        },
        error:(err)=>{
          console.log("failed to fetch profile",err)
          this.errorMessage="Could not load profile data";
        }
      })
  }

  onLogOut(){
    this.authService.logOut();
  }

}
