import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';
import { ProfileComponent } from './component/profile/profile.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'login' ,component:LoginComponent},
    {path:'signup',component:SignupComponent},
    {path:'profile',component:ProfileComponent,canActivate:[authGuard]},
    {path:"**",redirectTo:'login'}

];
