import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

export interface SystemLog {
  id: number;
  level: string;
  loggerName: string;
  message: string;
  exceptionType: string;
  stackTrace: string;
  createdAt: string;
}

@Component({
  selector: 'app-logs',
  imports: [DatePipe, FormsModule],
  templateUrl: './logs.html',
  styleUrl: './logs.scss'
})
export class Logs {

  lista: SystemLog[] = [];

  nivel: string = '';

  logSelecionado: SystemLog | null = null;

  semPermissao: boolean = false;

  constructor(private http: HttpClient) {
    this.listar();
  }

  listar() {
    let url = '/api/log/findAll';

    if (this.nivel != '') {
      url = url + '?level=' + this.nivel;
    }

    this.http.get<SystemLog[]>(url).subscribe({
      next: (lista) => {
        this.lista = lista;
        this.semPermissao = false;
      },
      error: (erro) => {
        this.semPermissao = erro.status == 403;
        this.lista = [];
      }
    });
  }

  filtrar(nivel: string) {
    this.nivel = nivel;
    this.listar();
  }

  detalhes(log: SystemLog) {
    this.logSelecionado = log;
  }

  fechar() {
    this.logSelecionado = null;
  }

  limpar() {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Todos os registros de log serao apagados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, limpar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete('/api/log/deleteAll', { responseType: 'text' }).subscribe({
          next: () => {
            Swal.fire('Logs apagados com sucesso');
            this.listar();
          },
          error: () => Swal.fire('Nao foi possivel apagar os logs')
        });
      }
    });
  }
}
