import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EventoService } from '../../services/evento.service';
import { CompraService } from '../../services/compras.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var bootstrap : any;

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrl: './evento.component.css'
})
export class EventoComponent implements OnInit {

  listaEvento: any[] = [];
  status : number = 0;
  formEvento : FormGroup;
  title : string = 'Listado de eventos';
  id !: number;
  encabezado : any;
  nameBoton : any;
  rol: any;
  compraForm!: FormGroup;
  eventoSeleccionado: any = null;
  zonas: any[] = [];
  precioZonaSeleccionada: number = 0;
  correoUsuario: string | null = '';
  
  constructor(
    private _eventoService: EventoService,
    private auth: AuthService,
    private router: Router,
    private compraService: CompraService,
    private cdr: ChangeDetectorRef
  ) {
    this.formEvento =  new FormGroup({
      nombreEvento : new FormControl(null),
      tipoEvento : new FormControl(null),
      lugar : new FormControl(null),
      fecha : new FormControl(null),
      hora : new FormControl(null),
      descripcion : new FormControl(null),
      disponibilidad: new FormControl('', Validators.required)
    })
  }


  ngOnInit(): void {
    this.rol = localStorage.getItem('rol');
    this.obtenerEvento();
    this.initForm();
    this.correoUsuario = localStorage.getItem('correo');
    this.compraForm = new FormGroup({
      correo: new FormControl({ value: this.correoUsuario, disabled: true }),
      metodoPago: new FormControl('', Validators.required),
      idZonaSeleccionada: new FormControl('', Validators.required),
      cantidad: new FormControl(1, [Validators.required, Validators.min(1)])
    });
  }

  initForm(){
      this.formEvento = new FormGroup({
        nombreEvento : new FormControl(null),
        tipoEvento : new FormControl(null),
        lugar : new FormControl(null),
        fecha : new FormControl(null),
        hora : new FormControl(null),
        descripcion : new FormControl(null),
        disponibilidad: new FormControl('', Validators.required),
      })
  }

  obtenerEvento(){
    if (this.rol === 'USER') {
      this._eventoService.listarDisponibles().subscribe((data: any) => {
        this.listaEvento = data;
        console.log("Eventos disponibles para usuario:", data);
      });
    } else {
      this._eventoService.listarEvento().subscribe((data: any) => {
        this.listaEvento = data;
        console.log("Lista de todos los eventos (ADMIN):", data);
      });
    }
  }

  obtenerEventoPorId(id : number){
    let form = this.formEvento
    this.id = id
    this._eventoService.obtenerEventoPorId(id)
    .subscribe( (data : any) => {
      console.log("evento con ID = 1", data)
      form.controls['nombreEvento'].setValue(data.nombreEvento)
      form.controls['tipoEvento'].setValue(data.tipoEvento)
      form.controls['lugar'].setValue(data.lugar)
      form.controls['fecha'].setValue(data.fecha)
      form.controls['hora'].setValue(data.hora)
      form.controls['descripcion'].setValue(data.descripcion)
    })
   }

  registrarEvento(request : any) {
    if(this.formEvento.valid){
      this._eventoService.registrarEvento(this.formEvento.value)
      .subscribe( response => {
        console.log("Respuesta: ", response)
        this.cerrarModal();
        this.obtenerEvento();
        this.resertForm();
      })
    }else{
      Object.values(this.formEvento.controls).forEach(control => {
        control.markAsTouched();
      });
      console.error('Formulario no valido')
      this.status = 0;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Datos incompletos',
        showConfirmButton: false,
        timer: 1500
      });
      this.status = 1;
    }
   }

  editarEvento(id : number, request : any) : void{
    if(this.formEvento.valid){
    this._eventoService.actualizarEvento(id, request)
    .subscribe( response => {
    this.cerrarModal();
    this.obtenerEvento();
    this.resertForm();
    this.alertaExitoso("Actualizado");
    }, error => {
    console.error('Error al modificar el registro: ', error)
    } )
    }else{
      console.error('Formulario no valido')
      this.status = 0;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Datos incompletos',
        showConfirmButton: false,
        timer: 1500
      });
      this.status = 1;
    }
  }

  alertaRegistrar() {
    Swal.fire({
      title: '¿Estás seguro de registrar este evento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.registrarEvento(this.formEvento.value)
      }
    });
  }  

  alertaModificar(){
    Swal.fire({
      title: '¿Estas seguro de modificar el registro?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, modificar',
      cancelButtonText: 'Cancelar',
    }).then( (result) => {
      if(result.isConfirmed){
        this.editarEvento(this.id, this.formEvento.value)
      }
    })
  }

  alertaEliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro de eliminar el registro?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this._eventoService.eliminarEvento(id).subscribe( (data) => {
          console.log("Evento eliminado", data)
          this.listaEvento = this.listaEvento.filter( item => item.id !== id );
        }, error => {
          console.error('Error en la eliminacion del registro', error)
        });
        this.alertaExitoso("eliminada");
        this.cerrarModal();
        this.obtenerEvento();
      }
    })
  }

  alertaExitoso(titulo : string){
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "evento " + titulo + " con exito",
      showConfirmButton: false,
      timer: 1500
    });
  }

   titulo( titulo : string , id : any ){
    this.encabezado = `${titulo} evento`;
    titulo == 'Crear' ? this.nameBoton = "Crear" : this.nameBoton = "Modificar";
    if( id != null ){
      this.obtenerEventoPorId(id);
    }
  }

  crearEditarEvento( boton : string ){
    if( boton == "Crear" ){
      this.alertaRegistrar()
    }else{
      this.alertaModificar()
    }
  }
  abrirFormularioCompra(evento: any) {
    this.correoUsuario = localStorage.getItem('correo');
    this.eventoSeleccionado = evento;
    this.zonas = evento.zonas || [];
    this.precioZonaSeleccionada = 0;
    this.compraForm.reset({ cantidad: 1 });
  }

  actualizarPrecio() {
  const idZona = this.compraForm.get('idZonaSeleccionada')?.value;
  const zona = this.zonas.find(z => z.idZona === +idZona);
  this.precioZonaSeleccionada = zona?.precio || 0;
  }


  confirmarCompra() {
  if (this.compraForm.invalid) return;

  const dto = {
  metodoPago: this.compraForm.get('metodoPago')?.value,
  idZonaSeleccionada: +this.compraForm.get('idZonaSeleccionada')?.value,
  cantidad: this.compraForm.get('cantidad')?.value
};


  console.log('DTO de compra:', dto);
  this.compraService.registrarCompra(dto).subscribe({
  next: (respuesta) => {
    console.log('Respuesta del backend:', respuesta);
    Swal.fire('Compra realizada', '¡Todo salió bien!', 'success');
    this.compraForm.reset();
    this.precioZonaSeleccionada = 0;
  },
  error: (err) => {
    console.error('Error al registrar la compra:', err);
    Swal.fire('Error', err?.error?.mensaje || 'No se pudo registrar la compra', 'error');
  }
});
  }
  
  cerrarModal(){
    const modalElement = document.getElementById('modalEvento')
    const modal = bootstrap.Modal.getInstance(modalElement)
    modal.hide();
  }

  resertForm(){
    this.formEvento.reset();
  }

  cerrarBoton(){
    this.resertForm();
    this.cerrarModal();
  }
  
  logout() {
    this.auth.cerrarSesion();
    this.router.navigate(['/login']);
  }
}