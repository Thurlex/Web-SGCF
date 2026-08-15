import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email: string = '';
  password: string = '';
  message = signal('');

  constructor(
    private authService:AuthService,
    private router: Router
  ){}

  login(): void{
      this.message.set('')
    const request ={
      email: this.email,
      password: this.password
    };

    this.authService.authenticate(request).subscribe({

      next: (response) => {

        console.log('Resposta do servidor', response)
        if(response === false){
          this.message.set('Usuário ou senha incorretos.');
        }else{
          this.message.set('bem-vindo.');
          this.router.navigate(['/dashboard'])
        }
      },
      error: (error)=>{
        this.message.set('Usuário ou senha incorretos.');
        console.error('Erro no servidor',error)
      }

    });

  }
}
