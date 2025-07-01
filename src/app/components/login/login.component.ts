import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  error: any;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.formLogin = new FormGroup({
      correo: new FormControl(null, [Validators.required]),
      contrasenia: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {}

  login() {
    if (this.formLogin.valid) {
      const { correo, contrasenia } = this.formLogin.value;
      
      this.auth.login(correo, contrasenia).subscribe({
        next: () => {
          const rol = this.auth.obtenerRol();

          if (rol === 'ADMIN') {
            this.router.navigate(['/menu']);
          } else if (rol === 'USER') {
            this.router.navigate(['/eventos']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.mostrarError('Correo o contraseña incorrectos');
        }
      });
    }
  }

  mostrarError(msg: string) {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: msg,
      showConfirmButton: false,
      timer: 1500
    });
    this.formLogin.reset();
  }
}