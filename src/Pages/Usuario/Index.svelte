<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
    import { activePage, host } from "../../store";
    import axios from "axios";
    $activePage ="mantenimiento.usuarios.index";

    let obj = {
        IdUser : 0,
        Prefix: "",
        Name: "",
        Email: "",
        PhoneNumber: "",
        PasswordHash: "",
        IsDoctor: false,
        PerfilID: 0
    }

    function cargarPrefijo() {
        axios.get($host + "/")
        .then(res => {
            console.log(res)
        }).catch(err => {
            console.error(err); 
        })
    }

    function guardar() {
        console.log(obj);
    }
</script>

<style>
  .icon-rol{
    color: #95aac9;
  }

</style>

<Aside />

<main class="admin-main">
  <Header />
  <section class="admin-content">
    <div class="container">
      <div class="row">


          <div class="mt-4 col-md-12">
              <div class="row">
                  <div class="col-md-5">
                      <div class="input-group input-group-flush mb-3">
                          <input type="search" class="form-control form-control-appended" data-bind="textInput: busqueda" placeholder="Buscar">
                          <div class="input-group-append">
                              <div class="input-group-text">
                                  <span class="mdi mdi-magnify"></span>
                              </div>
                          </div>
                      </div>
                  </div>
                  <a href="/Expediente/Nuevo" type="button" class="btn  m-b-30 ml-2 mr-2 ml-3 btn-primary" data-toggle="modal" data-target="#modalUsuario">
                      <i class="mdi mdi-account-plus"></i> Nuevo usuario
                  </a>
              </div>
          </div>

          <div class="col-lg-12">
            <div class="card m-b-30">
              <div class="card-header">
                  <h5 class="m-b-0">
                      Usuarios
                  </h5>
    
              </div>
              <div class="card-body">
                <div class="m-b-30">
                  <div class="table-responsive">
                      <table class="table align-td-middle">
                          <thead>
                              <tr>
                                  <th>Nombres</th>
                                  <!-- <th>Usuario</th> -->
                                  <th>Correo</th>
                                  <th></th>
                              </tr>
                          </thead>
                          <tbody data-bind="foreach: usuariosFiltrados">
                              <tr>
                                  <td>
                                      <div class="avatar avatar-sm mr-2 d-block-sm">
                                          <div class="avatar avatar-sm">
                                              <span class="avatar-title rounded-circle " data-bind="text: name[0]">A</span>
                                          </div>
      
                                      </div> <span data-bind="text: name">Alfredo Joel Mena</span>
                                  </td>
                                  <!-- <td data-bind="text: userName"></td> -->
                                  <td data-bind="text: userName">joel.mena@nxt-pro.com</td>
      
                                  <td>
                                      <div style="width: 150px; text-align: right;" class="ml-auto">
                                          <!-- <a data-toggle="tooltip" data-placement="top"
                                              data-original-title="Resetear contraseña" class="icon-table"><i
                                                  class="mdi-24px mdi mdi-lock-reset"></i></a> -->
                                          <a data-bind="click: $parent.editar" data-toggle="tooltip" style="cursor: pointer;" data-placement="top" data-original-title="Modificar usuario" class="icon-table hover-cursor"><i class=" mdi-24px mdi mdi-circle-edit-outline"></i></a>
                                          <a href="#" data-toggle="modal" data-bind="click: $parent.seleccionarUsuario" data-target="#modalRoles" data-placement="bottom" title="Asignar Roles" class="icon-rol"><i class=" mdi-24px mdi mdi-security"></i></a>
                                      </div>
                                  </td>
                              </tr>

                          </tbody>
                      </table>
      
                  </div>
              </div>
    
              </div>
          </div>
          </div>
  

  
      </div>
  </div>
  </section>
</main>



<div class="modal fade modal-slide-right" id="modalUsuario" tabindex="-1" role="dialog" aria-labelledby="modalUsuarioLabel" style="display: none; padding-right: 16px;" aria-modal="true">
  <div class="modal-dialog" role="document">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="modalUsuarioLabel">Usuario</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
              </button>
          </div>
          <div class="modal-body">

              <form id="frmUsuario" on:submit|preventDefault={guardar}>
                  <input type="hidden" name="IdUser" value="0">
                  <div class="form-row">
                    <div class="form-group col-md-12">
                        <label for="">Prefijo</label>
                        <select class="form-control" name="prefijo" bind:value={obj.Prefix}>
                            <option value="">- Seleccionar -</option>
                            <option value={'sr'}>Sr.</option>
                            <option value={'sra'}>Sra.</option>
                        </select>
                    </div>
                  </div>
                  <div class="form-row">
                      <div class="form-group col-md-12">
                          <label for="">Nombre Completo</label>
                          <input type="name" class="form-control" placeholder="Ing. John Doe" 
                            bind:value={obj.Name} name="Name" maxlength="200" required>
                      </div>
                  </div>
                  <div class="form-row">
                      <div class="form-group col-md-12" style="display: none;">
                          <label for="">Usuario</label>
                          <input type="email" class="form-control" autocomplete="off" name="UserName" id="" maxlength="100">
                      </div>
                      <div class="form-group col-md-12">
                          <label for="">Email</label>
                          <input type="email" required class="form-control" placeholder="usuario@correo.com"
                            bind:value={obj.Email} autocomplete="off" name="Email" id="txtCorreo" maxlength="100">
                      </div>
                  </div>
                  <div class="form-row">
                      <div class="form-group col-md-12">
                          <label for="">Contraseña</label>
                          <input type="password" class="form-control" required
                            bind:value={obj.PasswordHash} name="PasswordHash" maxlength="50">
                      </div>

                  </div>

                  <div class="form-row">
                      <div class="form-group col-md-12">
                          <label for="">Telefono</label>
                          <input type="text" class="form-control" data-mask="(000) 000-0000" data-mask-clearifnotmatch="true" autocomplete="off" maxlength="14" placeholder="(809) 000-0000" name="PhoneNumber" id="txtTelefono">
                      </div>
                      <div class="form-group col-md-12">
                          <label class="cstm-switch">
                              <input type="checkbox" value="true" name="EsMedico"
                                bind:checked={obj.IsDoctor} class="cstm-switch-input">
                              <span class="cstm-switch-indicator "></span>
                              <span class="cstm-switch-description">Es Medico </span>
                          </label>
                      </div>
                      <div class="form-group col-md-12">
                          <label for="">Perfil</label>
                          <select class="form-control" name="perfil">
                            <option value="1">- Seleccionar -</option>
                          </select>
                      </div>
                      
                      <div class="form-group col-md-12" style="display: none;">
                          <label for="">exequatur</label>
                          <input type="text" class="form-control" utocomplete="off" name="Exequatur" id="txtTelefono">
                      </div>
                      <div class="form-group col-md-12" style="display: none;">
                          <select  name="IdDepartamento" class="js-select2 select2-hidden-accessible" id="sltDepartamentos" style="width: 100%;" aria-hidden="true" tabindex="-1">
                              <option value="" ></option>
                              <option value="1" >Psiquiatría</option>
                          </select>
                          <span class="select2 select2-container select2-container--default" dir="ltr" style="width: 100%;"><span class="selection"><span class="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-labelledby="select2-sltDepartamentos-container"><span class="select2-selection__rendered" id="select2-sltDepartamentos-container" role="textbox" aria-readonly="true"><span class="select2-selection__placeholder">- Departamento -</span></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>
                      </div>
                  </div>

                  <br>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">
                          Cerrar
                      </button>
                      <button type="submit" class="btn btn-success">Guardar</button>
                  </div>
              </form>

          </div>
      </div>
  </div>
</div>



<div class="modal fade modal-slide-right" id="modalRoles" tabindex="-1" role="dialog" aria-labelledby="modalRolesLabel" style="display: none; padding-right: 16px;" aria-modal="true">
  <div class="modal-dialog" role="document">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="modalRolesLabel">Roles</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
              </button>
          </div>
          <div class="modal-body">

              <form id="">
                  <input type="hidden" name="idPaciente" value="">
                  <p><span class="badge badge-soft-primary" style="font-size: 17px;"></span>
                  </p>
                  <div class="form-group floating-label">
                      <label>Buscar</label>
                      <input type="text" class="form-control" placeholder="Buscar roles">
                  </div>
                  <div class="roles" >

                      <div class="lista-rol m-b-10">
                          <label class="cstm-switch d-flex bd-highlight">
                              <span class="cstm-switch-description mr-auto bd-highlight">Administrador</span>
                              <input type="checkbox" name="option" value="1" class="cstm-switch-input">
                              <span class="cstm-switch-indicator bg-success bd-highlight"></span>
                          </label>
                      </div>

                  

                      <div class="lista-rol m-b-10">
                          <label class="cstm-switch d-flex bd-highlight">
                              <span class="cstm-switch-description mr-auto bd-highlight">Especialista</span>
                              <input type="checkbox" name="option" value="1" class="cstm-switch-input">
                              <span class="cstm-switch-indicator bg-success bd-highlight"></span>
                          </label>
                      </div>

                  

                      <div class="lista-rol m-b-10">
                          <label class="cstm-switch d-flex bd-highlight">
                              <span class="cstm-switch-description mr-auto bd-highlight">Medico de planta</span>
                              <input type="checkbox" name="option" value="1" class="cstm-switch-input">
                              <span class="cstm-switch-indicator bg-success bd-highlight"></span>
                          </label>
                      </div>

                  </div>
              </form>

          </div>
      </div>
  </div>
</div>
