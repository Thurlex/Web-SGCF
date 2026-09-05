import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { resetPassword } from '../../../service/auth.passwor-request';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compare-tokem',
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './compare-tokem.component.html',
  styleUrl: './compare-tokem.component.scss'
})
export class CompareTokemComponent {

  tokenIsTrue: boolean = false ;
  email: string = "";
  tokem: string = "";
  newPassword: string = "";

  constructor(
    private router : Router ,
    private resetPasswordService: resetPassword
  ){}


  compreTokem():void{

    if (!this.email && !this.tokem) {
        Swal.fire({
          title: 'Warning',
          text: 'Não pode ter elementos vazio.',
          icon: 'warning'
        });
      }
      const request = { email: this.email, token: this.tokem };
      console.log(this.email)
      console.log(this.tokem);

      this.resetPasswordService.compareTokem(request).subscribe({
        next: (response) => {
          console.log(response.bool);
          if(response.bool){
            this.tokenIsTrue = true;
            Swal.fire({
                    title: 'Success!',
                    text: 'token certo, pode digitar sua nova senha.',
                    icon: 'success',
                    draggable: true
                  });
          }else{
            Swal.fire({
                title: 'Error!',
                text:  response.message,
                icon: 'error'
              });
          }
        },
        error: (error) => {
              console.error('Error requesting token:', error);

              Swal.fire({
                title: 'Error!',
                text: error?.error?.message || 'Aconteceu algum erro, porfavor tente novamente.',
                icon: 'error'
              });
            }
      })

  }

  trocarSenha():void {
    if (!this.email && !this.newPassword) {
        Swal.fire({
          title: 'Warning',
          text: 'Não pode ter elementos vazio.',
          icon: 'warning'
        });
        return;
    }

    const request = { email: this.email, password: this.newPassword };
      console.log(this.email)
      console.log(this.newPassword);

      this.resetPasswordService.changePassword(request).subscribe({
        next: (response) =>{
          if (response.bool){
            Swal.fire({
                    title: 'Success!',
                    text: 'Senha redefinida com sucesso.',
                    icon: 'success',
                    draggable: true
                  });
            this.router.navigate(['/login']);
          }else{
            Swal.fire({
                title: 'Error!',
                text:  response.message,
                icon: 'error'
              });
          }
        },
        error(error) {
          console.error('Error requesting token:', error);

              Swal.fire({
                title: 'Error!',
                text: error?.error?.message || 'Aconteceu algum erro, porfavor tente novamente.',
                icon: 'error'
              });
        },
      })
  }
}
