import { Component } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule,  } from '@angular/forms';
import { PasswordResetRequest, resetPassword } from '../../../service/auth.passwor-request';
import Swal from 'sweetalert2';


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
    private router: Router,
    private resetPasswordService: resetPassword
  ){}

  CreateToken(): void {
  if (!this.email) {
    Swal.fire({
      title: 'Warning',
      text: 'Email não pode ser vazio.',
      icon: 'warning'
    });
    return;
  }

  const request = { email: this.email };

  this.resetPasswordService.request(request).subscribe({
    next: (responseToken) => {
      console.log('Token generated:', responseToken);

      Swal.fire({
        title: 'Success!',
        text: 'Email enviado com sucesso.',
        icon: 'success',
        draggable: true
      });
      this.router.navigate(['/compare-tokem'])
    },
    error: (error) => {
      console.error('Error requesting token:', error);

      Swal.fire({
        title: 'Error!',
        text: error?.error?.message || 'Aconteceu algum erro, porfavor tente novamente.',
        icon: 'error'
      });
    }
  });
}

}


