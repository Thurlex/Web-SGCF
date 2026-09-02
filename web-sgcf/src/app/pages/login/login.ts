import { Component, signal } from '@angular/core';
import { FormsModule,  } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [FormsModule,MdbFormsModule ],
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
        if (!response) {
          this.message.set('Usuário ou senha incorretos.');
          return;
        }
        this.message.set('Bem-vindo.');
        this.router.navigate(['/dashboard']);
      },
      error: (error)=>{
        this.message.set('Usuário ou senha incorretos.');
      }

    });

  }
}
