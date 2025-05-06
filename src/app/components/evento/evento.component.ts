import { Component, OnInit } from '@angular/core';
import { EventoService } from '../../services/evento.service';
import { FormControl, FormGroup } from '@angular/forms';
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

  constructor(
    private _eventoService: EventoService
  ) {
    this.formEvento =  new FormGroup({
      nombreEvento : new FormControl(null),
      tipoEvento : new FormControl(null),
      lugar : new FormControl(null),
      fecha : new FormControl(null),
      hora : new FormControl(null),
      descripcion : new FormControl(null),
    })
  }

  ngOnInit(): void {
    this.obtenerEvento();
    this.initForm();
  }

  initForm(){
      this.formEvento = new FormGroup({
        nombreEvento : new FormControl(null),
        tipoEvento : new FormControl(null),
        lugar : new FormControl(null),
        fecha : new FormControl(null),
        hora : new FormControl(null),
        descripcion : new FormControl(null),
      })
  }

  obtenerEvento(){
        this._eventoService.listarEvento()
        .subscribe( (data : any) => {
          this.listaEvento = data
          console.log("Lista de evento: ", data)
        })
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
      this._eventoService.registrarEvento(request)
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
}