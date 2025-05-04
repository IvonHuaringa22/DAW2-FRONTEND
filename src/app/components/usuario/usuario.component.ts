import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

declare var bootstrap : any;

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {

  listaUsuario: any[] = [];
  status : number = 0;
  formUsuario : FormGroup;
  title : string = 'Listado de usuarios';
  id !: number;
  encabezado : any;
  modoRegistro: boolean = true;

  constructor(
    private _usuarioService: UsuarioService
  ) {
    this.formUsuario =  new FormGroup({
      nombre : new FormControl(null),
      correo : new FormControl(null),
      contrasenia : new FormControl(null),
      rol : new FormControl(null),
    })
  }

  ngOnInit(): void {
    this.obtenerUsuario();
    this.initForm();
  }

  initForm(){
      this.formUsuario = new FormGroup({
        nombre : new FormControl(null),
        correo : new FormControl(null),
        contrasenia : new FormControl(null),
        rol : new FormControl('A'),
      })
  }

  obtenerUsuario(){
        this._usuarioService.listarUsuario()
        .subscribe( (data : any) => {
          this.listaUsuario = data
          console.log("Lista de usuario: ", data)
        })
  }

  obtenerUsuarioPorId(id : number){
    let form = this.formUsuario
    this.id = id
    this._usuarioService.obtenerUsuarioPorId(id)
    .subscribe( (data : any) => {
      console.log("Usuario con ID = 1", data)
      form.controls['nombre'].setValue(data.nombre)
      form.controls['correo'].setValue(data.correo)
      form.controls['rol'].setValue(data.rol)
    })
   }

  registrarUsuario() {
    if (this.formUsuario.valid) {
      this._usuarioService.registrarUsuario(this.formUsuario.value)
        .subscribe(response => {
          this.cerrarModal();
          this.obtenerUsuario();
          this.resertForm();
          this.alertExitoso("registrado");
          console.log("Usuario registrado:", response);
        }, error => {
          console.error("Error al registrar usuario:", error);
        });
    }
  } 

  editarUsuario(id : number, formulario : any) : void{
    if(this.formUsuario.valid){
      this._usuarioService.actualizarUsuario(id, formulario)
      .subscribe( response => {
        this.cerrarModal();
        this.obtenerUsuario();
        this.resertForm();
        console.log('Usuario modificado: ' , response)
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
        this.editarUsuario(this.id, this.formUsuario.value)
        this.alertExitoso("actualizada");
      }
    })
   }

   guardarUsuario() {
    if (this.id != null) {
      this.alertaModificar();
    } else {
      this.registrarUsuario();
    }
  }

   alertEliminar(id : number){
    Swal.fire({
      title: '¿Estas seguro de eliminar el registro?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then( (result) => {
      if(result.isConfirmed){
        this._usuarioService.eliminarUsuario(id)
        .subscribe( (data) => {
          console.log("Usuario eliminado", data)
          this.listaUsuario = this.listaUsuario.filter( item => item.id !== id );
        }, error => {
          console.error('Error en la eliminacion del registro', error)
        });

        this.alertExitoso("eliminada");

      }
    })
   }

   alertExitoso(titulo : string){
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Usuario " + titulo + " con exito",
      showConfirmButton: false,
      timer: 1500
    });
   }

   alertaRegistrar() {
    Swal.fire({
      title: '¿Estás seguro de registrar este usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.alertExitoso("Registrado");
      }
    });
  }  

   titulo( titulo : string , id : any ){
    this.encabezado = `${titulo} usuario`;

    if( id != null ){
      this.modoRegistro = false;
      this.obtenerUsuarioPorId(id);
    }
    else {
      this.modoRegistro = true; // cuando se registra
      this.resertForm();
    }

   }

   cerrarModal(){
    const modalElement = document.getElementById('modalUsuario')
    const modal = bootstrap.Modal.getInstance(modalElement)
    modal.hide();
   }

   resertForm(){
    this.formUsuario.reset();
    this.formUsuario.controls['rol'].setValue('A')
   }

   cerrarBoton(){
    this.resertForm();
    this.cerrarModal();
   }

}