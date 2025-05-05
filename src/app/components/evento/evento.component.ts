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
  modoRegistro: boolean = true;

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

  registrarEvento() {
    if (this.formEvento.valid) {
      this._eventoService.registrarEvento(this.formEvento.value)
        .subscribe(response => {
          this.cerrarModal();
          this.obtenerEvento();
          this.resertForm();
          this.alertaExitoso("registrado");
          console.log("Evento registrado:", response);
        }, error => {
          console.error("Error al registrar evento:", error);
        });
    }
  } 

  editarEvento(id : number, formulario : any) : void{
    if(this.formEvento.valid){
    this._eventoService.actualizarEvento(id, formulario)
    .subscribe( response => {
    this.cerrarModal();
    this.obtenerEvento();
    this.resertForm();
    console.log('evento modificado: ' , response)
    }, error => {
    console.error('Error al modificar el registro: ', error)
    } )
    }
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
        this.alertaExitoso("actualizada");
        this.resertForm();
      }
    })
   }

   guardarEvento() {
    if (this.id != null) {
      this.alertaModificar();
    } else {
      this.registrarEvento();
    }
  }

  alertaEliminar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro de eliminar el registro?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this._eventoService.eliminarEvento(id).subscribe({
          next: () => {
            // Actualiza la lista local eliminando el evento
            this.listaEvento = this.listaEvento.filter((item) => item.idEvento !== id);
            this.alertaExitoso('eliminada');
          },
          error: (err) => {
            console.error('Error en la eliminación del registro:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al intentar eliminar el evento.',
            });
          },
        });
      }
    });
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

   alertaRegistrar() {
    Swal.fire({
      title: '¿Estás seguro de registrar este evento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.alertaExitoso("Registrado");
      }
    });
  }  

   titulo( titulo : string , id : any ){
    this.encabezado = `${titulo} evento`;

    if( id != null ){
      this.modoRegistro = false;
      this.obtenerEventoPorId(id);
    }
    else {
      this.modoRegistro = true; // cuando se registra
      this.resertForm();
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