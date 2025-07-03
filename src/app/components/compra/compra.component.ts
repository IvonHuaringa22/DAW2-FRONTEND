import { Component, OnInit } from '@angular/core';
import { CompraService } from '../../services/compras.service';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css'] // 👈 ojo, debe ser 'styleUrls' con 's'
})
export class CompraComponent implements OnInit {
  compras: any[] = [];
  rol: string | null = '';
  correoUsuario: string | null = '';

  constructor(private compraService: CompraService) {}

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol');
    this.correoUsuario = localStorage.getItem('correo');

    if (this.rol === 'ADMIN') {
      this.compraService.listarTodas().subscribe({
        next: (data) => this.compras = data,
        error: (err) => console.error('Error al cargar compras:', err)
      });
    } 
  }
}