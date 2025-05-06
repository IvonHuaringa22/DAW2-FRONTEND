import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
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
  formUpdateUsuario : FormGroup;

  title : string = 'Listado de usuarios';
  id !: number;
  encabezado : any;
  modoRegistro: boolean = true;
  nameBoton : any;

  constructor(
    private _usuarioService: UsuarioService
  ) {
    this.formUsuario =  new FormGroup({
      nombre : new FormControl(null),
      correo : new FormControl(null),
      contrasenia : new FormControl(null),
      rol : new FormControl(null),
    })
    this.formUpdateUsuario = new FormGroup({
      nombre : new FormControl(null),
      correo : new FormControl(null),
      rol : new FormControl(null),
    })
  }

  ngOnInit(): void {
    this.obtenerUsuario();
    this.initForm();
  }

  initForm(){
      this.formUsuario = new FormGroup({
        nombre : new FormControl(null, Validators.required),
        correo : new FormControl(null, [Validators.required, Validators.email]),
        contrasenia : new FormControl(null, Validators.required),
        rol : new FormControl('ADMIN', Validators.required),
      })
      this.formUpdateUsuario = new FormGroup({
        nombre : new FormControl(null),
        correo : new FormControl(null),
        rol : new FormControl('ADMIN'),
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
    let form = this.formUpdateUsuario
    this.id = id
    this._usuarioService.obtenerUsuarioPorId(id)
    .subscribe( (data : any) => {
      console.log("Usuario con ID = 1", data)
      form.controls['nombre'].setValue(data.nombre)
      form.controls['correo'].setValue(data.correo)
      form.controls['rol'].setValue(data.rol)
    })
   }

   registrarUsuario(request : any) {
    if(this.formUsuario.valid){
      this._usuarioService.registrarUsuario(request)
      .subscribe( response => {
        console.log("Respuesta: ", response)
        this.cerrarModal();
        this.obtenerUsuario();
        this.resertForm();
      })
    }else{
      Object.values(this.formUsuario.controls).forEach(control => {
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

  editarUsuario(id : number, request : any) : void{
    if(this.formUpdateUsuario.valid){
      this._usuarioService.actualizarUsuario(id, request)
      .subscribe( response => {
        this.cerrarModal();
        this.obtenerUsuario();
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
      title: '¿Estás seguro de registrar este usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.registrarUsuario(this.formUsuario.value)
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
        this.editarUsuario(this.id, this.formUpdateUsuario.value)
      }
    })
   }

   alertaEliminar(id : number){
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
        this.alertaExitoso("eliminada");
        this.cerrarModal();
        this.obtenerUsuario();
      }
    })
   }

   alertaExitoso(titulo : string){
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Usuario " + titulo + " con exito",
      showConfirmButton: false,
      timer: 1500
    });
   }

   titulo( titulo : string , id : any ){
    this.encabezado = `${titulo} usuario`;
    titulo == 'Crear' ? this.nameBoton = "Crear" : this.nameBoton = "Modificar";
    if( id != null ){
      this.obtenerUsuarioPorId(id);
    }
  }

  crearEditarUsuario( boton : string ){
    if( boton == "Crear" ){
      this.alertaRegistrar()
    }else{
      this.alertaModificar()
    }
  }

  cerrarModal(){
    const modalElement = document.getElementById('modalUsuario');
    if (modalElement) {
      let modal = bootstrap.Modal.getInstance(modalElement);
      if (!modal) {
        modal = new bootstrap.Modal(modalElement);
      }
      modal.hide();
    }
  }

  cerrarModalEdit() {
    const modalEditElement = document.getElementById('modalUpdateUsuario');
    if (modalEditElement) {
      let modalEdit = bootstrap.Modal.getInstance(modalEditElement);
      if (!modalEdit) {
        modalEdit = new bootstrap.Modal(modalEditElement);
      }
      modalEdit.hide();
    }
  }

  resertForm(){
    this.formUsuario.reset();
    this.formUsuario.controls['rol'].setValue('A')
  }

  cerrarBoton(boton: string) {
    this.resertForm();
    if (boton === "Crear") {
      this.cerrarModal();
    } else {
      this.cerrarModalEdit();
    }
  }
  
}