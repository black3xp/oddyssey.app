<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
  import { activePage, host } from "../../store";

  $activePage = "mantenimiento.index";
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
                      <i class="mdi mdi-account-plus"></i> Nuevo medico
                  </a>
              </div>
          </div>

          <div class="col-lg-12">
            <div class="card m-b-30">
              <div class="card-header">
                  <h5 class="m-b-0">
                      Medicos
                  </h5>
    
              </div>
              <div class="card-body">
                <div class="m-b-30">
                  <div class="table-responsive">
                      <table class="table align-td-middle">
                          <thead>
                              <tr>
                                  <th>Nombres</th>
                                  <th>Especialidad</th>
                                  <th>Telefono</th>
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
                                  <td>Ginecologia</td>
                                  <td data-bind="text: userName">809-588-1717</td>
      
                                  <td>
                                      <div style="width: 150px; text-align: right;" class="ml-auto">
                                        <div class="row">
                                          <a href="#/Medico/Perfil" class="btn btn-outline-primary btn-sm mr-2"><i class="mdi mdi-circle-edit-outline"></i> Editar</a>
                                          <a href="#/Medico/Perfil" class="btn btn-outline-success btn-sm"><i class="mdi mdi-account-outline"></i> Ver perfil</a>
                                        </div>
                                      </div>
                                  </td>
                              </tr>
                              <tr>
                                <td>
                                    <div class="avatar avatar-sm mr-2 d-block-sm">
                                        <div class="avatar avatar-sm">
                                            <span class="avatar-title rounded-circle " data-bind="text: name[0]">A</span>
                                        </div>
    
                                    </div> <span data-bind="text: name">Alfredo Joel Mena</span>
                                </td>
                                <td>Ginecologia</td>
                                <td data-bind="text: userName">809-588-1717</td>
    
                                <td>
                                  <div style="width: 150px; text-align: right;" class="ml-auto">
                                    <div class="row">
                                      <a href="#/Medico/Perfil" class="btn btn-outline-primary btn-sm mr-2"><i class="mdi mdi-circle-edit-outline"></i> Editar</a>
                                      <a href="#/Medico/Perfil" class="btn btn-outline-success btn-sm"><i class="mdi mdi-account-outline"></i> Ver perfil</a>
                                    </div>
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
              <h5 class="modal-title" id="modalUsuarioLabel">Nuevo medico</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
              </button>
          </div>
          <div class="modal-body">

              <form id="frmUsuario">
                  <input type="hidden" name="IdUser" value="0">
                  <div class="form-row">
                      <div class="form-group col-md-12">
                          <label for="">Nombre Completo</label>
                          <input type="name" class="form-control" placeholder="Dr. John Doe" name="Name" maxlength="200" required="">
                      </div>
                  </div>
                  <div class="form-row">
                      <div class="form-group col-md-12" style="display: none;">
                          <label for="">Usuario</label>
                          <input type="email" class="form-control" autocomplete="off" name="UserName" id="" maxlength="100">
                      </div>
                      <div class="form-group col-md-12">
                          <label for="">Email</label>
                          <input type="email" required="" class="form-control" placeholder="usuario@correo.com" autocomplete="off" name="Email" id="txtCorreo" maxlength="100">
                      </div>
                  </div>

                  <div class="form-row">
                      <div class="form-group col-md-12">
                          <label for="">Telefono</label>
                          <input type="text" class="form-control" data-mask="(000) 000-0000" data-mask-clearifnotmatch="true" autocomplete="off" maxlength="14" placeholder="(809) 000-0000" name="PhoneNumber" id="txtTelefono">
                      </div>

                      <div class="form-group col-md-12" style="display: none;">
                          <label for="">exequatur</label>
                          <input type="text" class="form-control" utocomplete="off" name="Exequatur" id="txtTelefono">
                      </div>
                      <div class="form-group col-md-12" style="display: none;">
                          <select  name="IdDepartamento" class="js-select2 select2-hidden-accessible" id="sltDepartamentos" style="width: 100%;" aria-hidden="true" tabindex="-1">
                              <option value="" ></option>
                          <option value="1" >Psiquiatría</option></select><span class="select2 select2-container select2-container--default" dir="ltr" style="width: 100%;"><span class="selection"><span class="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-labelledby="select2-sltDepartamentos-container"><span class="select2-selection__rendered" id="select2-sltDepartamentos-container" role="textbox" aria-readonly="true"><span class="select2-selection__placeholder">- Departamento -</span></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>
                      </div>
                  </div>
                  <div class="form-row">
                      <div class="form-group col-md-12">
                          <label for="">Observaciones</label>
                          <textarea class="form-control" rows="3" name="Observaciones"></textarea>
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
