<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
  import { activePage, host } from "../../store";
  import { onMount } from "svelte";
  import axios from "axios";
  $activePage = "mantenimiento.usuarios.index";

  let perfiles = [];
  let list = [];
  let prefijos = [
    {value: 'dr', name: 'Dr.'},
    {value: 'dra', name: 'Dra.'},
    {value: 'lic', name: 'Lic.'},
    {value: 'lida', name: 'Lida.'},
    {value: 'sr', name: 'Sr.'},
    {value: 'sra', name: 'Sra.'},
  ]
  let userID = "";
  let obj = {
    prefix: "",
    name: "",
    email: "",
    phoneNumber: "",
    passwordHash: "",
    isDoctor: false,
    perfilID: 0
  };
  onMount(() => {
    cargar();
    cargarPerfil();
  });

  function cargar() {
    axios.get($host + "/User/Query", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }).then(res => {
        list = res.data;
      }).catch(err => {
        console.error(err);
      });
  }
  function cargarDetalle(id) {
    axios.get($host + "/User/" + id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }).then(res => {
        userID = id
        obj = res.data;
      }).catch(err => {
        console.error(err);
      });
  }
  function cargarPerfil() {
    axios.get($host + "/Perfiles/GetAll", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }).then(res => {
        perfiles = res.data;
      }).catch(err => {
        console.error(err);
      });
  }

  function guardar() {
    if (userID == "") {
      axios.post($host + "/User", obj, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.success) {
          jQuery('#modalUsuario').modal('hide');
          cargar();
        }
      }).catch(err => {
        console.error(err);
      });
    } else {
      axios.put($host + "/User/" + userID, obj, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.success) {
          jQuery('#modalUsuario').modal('hide');
          cargar();
        }
      }).catch(err => {
        console.error(err);
      });
    }
  }

  function agregarNuevo() {
    userID = "";
    obj = {
      prefix: "",
      name: "",
      email: "",
      phoneNumber: "",
      passwordHash: "",
      isDoctor: false,
      perfilID: 0
    }
  }

</script>

<style>
  .icon-rol {
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
                <input
                  type="search"
                  class="form-control form-control-appended"
                  data-bind="textInput: busqueda"
                  placeholder="Buscar" />
                <div class="input-group-append">
                  <div class="input-group-text">
                    <span class="mdi mdi-magnify" />
                  </div>
                </div>
              </div>
            </div>
            <button class="btn m-b-30 ml-2 mr-2 ml-3 btn-primary"
              on:click={agregarNuevo}
              data-toggle="modal"
              data-target="#modalUsuario">
              <i class="mdi mdi-account-plus" />
              Nuevo usuario
            </button>
          </div>
        </div>

        <div class="col-lg-12">
          <div class="card m-b-30">
            <div class="card-header">
              <h5 class="m-b-0">Usuarios</h5>

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
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {#each list as i}
                        <tr>
                          <td>
                            <div class="avatar avatar-sm mr-2 d-block-sm">
                              <div class="avatar avatar-sm">
                                <span class="avatar-title rounded-circle ">{i.name[0]}</span>
                              </div>
                            </div>
                            <span>{i.name}</span>
                          </td>
                          <td>{i.email}</td>
                          <td>
                            <div style="width: 150px; text-align: right;" class="ml-auto">
                              {#if i.isDoctor}
                              <a href="#/Medico/Perfil/{i.id}">
                                <i class=" mdi-24px mdi mdi-doctor" />
                              </a>
                              {/if}
                              <a href="#!"
                                on:click={cargarDetalle(i.id)}
                                data-toggle="modal"
                                style="cursor: pointer;"
                                data-placement="top"
                                data-target="#modalUsuario"
                                data-original-title="Modificar usuario"
                                class="icon-table hover-cursor">
                                <i class=" mdi-24px mdi mdi-circle-edit-outline" />
                              </a>
                              <a href="#!"
                                data-toggle="modal"
                                data-target="#modalRoles"
                                data-placement="bottom"
                                title="Asignar Roles"
                                class="icon-rol">
                                <i class=" mdi-24px mdi mdi-security" />
                              </a>
                              
                            </div>
                          </td>
                        </tr>
                      {/each}

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

<form id="frmUsuario" on:submit|preventDefault={guardar}>
<div class="modal fade modal-slide-right"
  id="modalUsuario"
  tabindex="-1"
  role="dialog"
  aria-labelledby="modalUsuarioLabel"
  style="display: none; padding-right: 16px;"
  aria-modal="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalUsuarioLabel">Usuario</h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div class="modal-body" style="height: 100% !important; top: 0; overflow: auto;">

          <input type="hidden" name="IdUser" value="0" />
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Prefijo</label>
              <select
                class="form-control"
                name="prefijo"
                bind:value={obj.prefix} required>
                <option value="">- Seleccionar -</option>
                {#each prefijos as item}
                  <option value={item.value}>{item.name}</option>
                {/each}
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Nombre Completo</label>
              <input
                type="name"
                class="form-control"
                placeholder="Ing. John Doe"
                bind:value={obj.name}
                name="Name"
                maxlength="200"
                required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12" style="display: none;">
              <label for="">Usuario</label>
              <input
                type="email"
                class="form-control"
                autocomplete="off"
                name="UserName"
                id=""
                maxlength="100" />
            </div>
            <div class="form-group col-md-12">
              <label for="">Email</label>
              <input
                type="email"
                required
                class="form-control"
                placeholder="usuario@correo.com"
                bind:value={obj.email}
                autocomplete="off"
                name="Email"
                id="txtCorreo"
                maxlength="100" />
            </div>
          </div>
          {#if userID == ""}
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Contraseña</label>
              <input
                type="password"
                class="form-control"
                required
                bind:value={obj.passwordHash}
                name="PasswordHash"
                maxlength="50" />
            </div>
          </div>
          {/if}

          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Telefono</label>
              <input
                type="text"
                class="form-control"
                data-mask="(000) 000-0000"
                data-mask-clearifnotmatch="true"
                autocomplete="off"
                maxlength="14"
                placeholder="(809) 000-0000"
                bind:value={obj.phoneNumber}/>
            </div>
            <div class="form-group col-md-12">
              <label class="cstm-switch">
                <input
                  type="checkbox"
                  value="true"
                  name="EsMedico"
                  bind:checked={obj.isDoctor}
                  class="cstm-switch-input" />
                <span class="cstm-switch-indicator " />
                <span class="cstm-switch-description">Es Medico</span>
              </label>
            </div>
            {#if obj.isDoctor}
              <div class="form-group col-md-12">
                <label for="">Perfil</label>
                <select
                  class="form-control"
                  name="perfil"
                  bind:value={obj.perfilID} required>
                  <option value={0}>- Seleccionar -</option>
                  {#each perfiles as item}
                    <option value={item.id}>{item.nombre}</option>
                  {/each}
                </select>
              </div>
              <div class="form-group col-md-12">
                <label for="">Asistentes</label>
                <select
                  class="form-control"
                  name="asistentes"
                  required>
                  <option value="0">- Seleccionar -</option>

                    <option value="Henry">HEnry</option>

                </select>
              </div>
              <div class="agregados col-lg-12">
                <button type="button" class="btn btn-primary btn-block">Joel Mena</button>
              </div>
            {/if}

            <div class="form-group col-md-12" style="display: none;">
              <label for="">exequatur</label>
              <input
                type="text"
                class="form-control"
                utocomplete="off"
                name="Exequatur"
                id="txtTelefono" />
            </div>
            <div class="form-group col-md-12" style="display: none;">
              <select
                name="IdDepartamento"
                class="js-select2 select2-hidden-accessible"
                id="sltDepartamentos"
                style="width: 100%;"
                aria-hidden="true"
                tabindex="-1">
                <option value="" />
                <option value="1">Psiquiatría</option>
              </select>
              <span class="select2 select2-container select2-container--default"
                dir="ltr"
                style="width: 100%;">
                <span class="selection">
                  <span class="select2-selection select2-selection--single"
                    role="combobox"
                    aria-haspopup="true"
                    aria-expanded="false"
                    tabindex="0"
                    aria-labelledby="select2-sltDepartamentos-container">
                    <span class="select2-selection__rendered"
                      id="select2-sltDepartamentos-container"
                      role="textbox"
                      aria-readonly="true">
                      <span class="select2-selection__placeholder">
                        - Departamento -
                      </span>
                    </span>
                    <span class="select2-selection__arrow" role="presentation">
                      <b role="presentation" />
                    </span>
                  </span>
                </span>
                <span class="dropdown-wrapper" aria-hidden="true" />
              </span>
            </div>
          </div>

          <br />
          
          
        </div>
        <div class="modal-footer">
          <button type="button"
          class="btn btn-secondary"
          data-dismiss="modal">
          Cerrar
        </button>
        <button type="submit" class="btn btn-success">Guardar</button>
      </div>
    </div>
  </div>
</div>
</form>

<div
  class="modal fade modal-slide-right"
  id="modalRoles"
  tabindex="-1"
  role="dialog"
  aria-labelledby="modalRolesLabel"
  style="display: none; padding-right: 16px;"
  aria-modal="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalRolesLabel">Roles</h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div class="modal-body">

        <form id="">
          <input type="hidden" name="idPaciente" value="" />
          <p>
            <span class="badge badge-soft-primary" style="font-size: 17px;" />
          </p>
          <div class="form-group floating-label">
            <label>Buscar</label>
            <input
              type="text"
              class="form-control"
              placeholder="Buscar roles" />
          </div>
          <div class="roles">

            <div class="lista-rol m-b-10">
              <label class="cstm-switch d-flex bd-highlight">
                <span class="cstm-switch-description mr-auto bd-highlight">
                  Administrador
                </span>
                <input
                  type="checkbox"
                  name="option"
                  value="1"
                  class="cstm-switch-input" />
                <span class="cstm-switch-indicator bg-success bd-highlight" />
              </label>
            </div>

            <div class="lista-rol m-b-10">
              <label class="cstm-switch d-flex bd-highlight">
                <span class="cstm-switch-description mr-auto bd-highlight">
                  Especialista
                </span>
                <input
                  type="checkbox"
                  name="option"
                  value="1"
                  class="cstm-switch-input" />
                <span class="cstm-switch-indicator bg-success bd-highlight" />
              </label>
            </div>

            <div class="lista-rol m-b-10">
              <label class="cstm-switch d-flex bd-highlight">
                <span class="cstm-switch-description mr-auto bd-highlight">
                  Medico de planta
                </span>
                <input
                  type="checkbox"
                  name="option"
                  value="1"
                  class="cstm-switch-input" />
                <span class="cstm-switch-indicator bg-success bd-highlight" />
              </label>
            </div>

          </div>
        </form>

      </div>
    </div>
  </div>
</div>
