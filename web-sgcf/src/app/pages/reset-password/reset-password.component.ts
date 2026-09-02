import { Component, input } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule,  } from '@angular/forms';


@Component({
  selector: 'app-reset-password',
  imports: [MdbFormsModule,FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
 email: string = "";

 constructor(
    private authService:AuthService,
    private router: Router
  ){}

  Login(): void{
    const request ={
      email: this.email
    }
  }
}


