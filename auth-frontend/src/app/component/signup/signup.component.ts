import { Component, Inject, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupData={email:'',password:''}
  successMessage='';
  errorMessage='';
  constructor(private authService:AuthService,private router:Router){}

  onSignUp(){
    this.successMessage='';
    this.errorMessage='';
    const {email,password}=this.signupData;
   
    
    this.authService.singUp(email,password).subscribe({
      next:()=>{
        this.successMessage='Registration successfull! please login';
        this.signupData={email:'',password:''};
        this.router.navigate(['/login'])
        
        
      },
      error:(err)=>{
        this.errorMessage=err.error?.message || "Signup failed, Please try again."
      }
    })

  }
}
