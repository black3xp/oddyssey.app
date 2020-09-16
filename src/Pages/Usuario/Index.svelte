<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
  import { push } from "svelte-spa-router";
  import { activePage, host, axios, session } from "../../store";
  import { UserManager } from "../../util.js";
  import { onMount } from "svelte";
  import Swal from 'sweetalert2';

  let user = {};
  user = new UserManager($session.authorizationHeader.Authorization)
  if (!user.isAny(['admin'])) {
    push('/Home/Unauthorized');
  }

  $axios.defaults.headers.common = {
    Authorization: $session.authorizationHeader.Authorization
  };

  $activePage = "mantenimiento.usuarios.index";

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  $: filterRoles = roles.map(x => {
    return {
      id : x.id,
      name : x.name,
      displayName: x.displayName,
      checked: rolesUser.some(y => y == x.name)
    }
  }).filter(x => x.displayName.toLowerCase().includes(busquedaRoles.toLowerCase()));

  let asistentesAsignado = [];
  let asistentes = [];
  let perfiles = [];
  let roles = [];
  let rolesUser = [];
  let list = [];
  let prefijos = [
    {value: 'dr', name: 'Dr.'},
    {value: 'dra', name: 'Dra.'},
    {value: 'lic', name: 'Lic.'},
    {value: 'lida', name: 'Lida.'},
    {value: 'sr', name: 'Sr.'},
    {value: 'sra', name: 'Sra.'},
  ]
  let obj = {
    prefix: "",
    name: "",
    email: "",
    phoneNumber: "",
    passwordHash: "",
    isDoctor: false,
    perfilID: null
  };
  let userID = "";
  let busqueda = "";
  let busquedaRoles = "";
  let asistenteID = "";

  onMount(() => {
    cargar();
    cargarAsistentes();
    cargarPerfil();
    cargarRoles()
  });

  function cargar() {
    $axios.get("/Users?keyword=" + busqueda)
    .then(res => {
        list = res.data;
      }).catch(err => {
        console.error(err);
      });
  }
  function cargarDetalle(id) {
    userID = id;
    $axios.get("/Users/" + id)
    .then(res => {
        userID = id
        obj = res.data;
        cargarAsistentesAsignado();
      }).catch(err => {
        console.error(err);
      });
  }
  function cargarPerfil() {
    $axios.get("/Perfiles/GetAll").then(res => {
        perfiles = res.data;
      }).catch(err => {
        console.error(err);
      });
  }
  function cargarAsistentesAsignado() {
    $axios.get("/Medicos/" + userID + "/Asistentes")
    .then(res => {
        asistentesAsignado = res.data;
      }).catch(err => {
        console.error(err);
      });
  }
  function cargarAsistentes() {
    $axios.get("/Users/assistant/All")
    .then(res => {
        asistentes = res.data;
      }).catch(err => {
        console.error(err);
      });
  }
  function cargarRoles() {
    $axios.get("/Roles")
    .then(res => {
        roles = res.data;
      }).catch(err => {
        console.error(err);
      });
  }
  function cargarRolesUser(id) {
    userID = id;
    $axios.get("Users/" + userID + "/Roles")
    .then(res => {
        rolesUser = res.data;
      }).catch(err => {
        console.error(err);
      });
  }

  function guardar() {
    if (userID == "") {
      $axios.post("/Users", obj)
      .then(res => {
        if (res.data.success) {
          Toast.fire({
            icon: 'success',
            title: 'Usuario guardado con exito'
          })
          jQuery('#modalUsuario').modal('hide');
          cargar();
        }
      }).catch(err => {
        console.error(err);
      });
    } else {
      $axios.put("/Users/" + userID, obj)
      .then(res => {
        if (res.data.success) {
          Toast.fire({
            icon: 'success',
            title: 'Usuario guardado con exito'
          })
          jQuery('#modalUsuario').modal('hide');
          cargar();
        }
      }).catch(err => {
        console.error(err);
      });
    }
  }
  function agregarRol(rol, checked) {
    checked = Boolean(checked)
    if (checked) {
      $axios.post('/Users/' + userID + "/RemoveFrom?role=" + rol)
      .then(res => {
        cargarRolesUser(userID)
      }).catch(err => {
        console.error(err);
      })
    } else {
      $axios.post('/Users/' + userID + "/AddTo?role=" + rol)
      .then(res => {
        cargarRolesUser(userID)
      }).catch(err => {
        console.error(err); 
      })
    }
  }
  function agregarAsistente() {
    let obj = {
      AsistenteID: asistenteID,
      MedicoID: userID
    }
    $axios.post('/MedicosAsistentes', obj)
    .then(res => {
      if (res.data.success) {
        cargarAsistentesAsignado();
      }
    }).catch(err => {
      console.error(err); 
    })
  }
  function eliminarAsistente(item) {
    let obj = {
      AsistenteID: item.asistenteID,
      MedicoID: item.medicoID
    }
    let qs = Object.entries(obj).map(e => e.join('=')).join('&');

    $axios.delete('/MedicosAsistentes?' + qs)
    .then(res => {
      if (res.data.success) {
        cargarAsistentesAsignado();
      }
    }).catch(err => {
      console.error(err); 
    })
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
      perfilID: null
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
                  placeholder="Buscar"
                  bind:value={busqueda}
                  on:input={cargar} />
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
                                on:click={() => cargarDetalle(i.id)}
                                data-toggle="modal"
                                style="cursor: pointer;"
                                data-placement="top"
                                data-target="#modalUsuario"
                                data-original-title="Modificar usuario"
                                class="icon-table hover-cursor">
                                <i class=" mdi-24px mdi mdi-circle-edit-outline" />
                              </a>
                              <a href="#!"
                                on:click={() => cargarRolesUser(i.id)}
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
                  <option value="" disabled>- Seleccionar -</option>
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
                  <select class="form-control" name="perfil"
                    bind:value={obj.perfilID} required>
                    <option value="" disabled>- Seleccionar -</option>
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
                    bind:value={asistenteID}
                    on:change={agregarAsistente}>
                    <option value="" disabled>- Agregar -</option>
                    {#each asistentes as item}
                    <option value={item.id}>{item.name}</option>
                    {/each}
                  </select>
                </div>
                <div class="agregados col-lg-12">
                  {#each asistentesAsignado as item}
                  <button type="button" 
                    class="btn btn-primary btn-block"
                    on:click={ () => eliminarAsistente(item) }>{item.nombreAsistente}</button>
                  {/each}
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
              bind:value={busquedaRoles}
              placeholder="Buscar roles" />
          </div>
          <div class="roles">
            {#each filterRoles as item}
            <div class="lista-rol m-b-10">
              <label class="cstm-switch d-flex bd-highlight">
                <span class="cstm-switch-description mr-auto bd-highlight">
                  {item.displayName}
                </span>
                <input
                  type="checkbox"
                  name="option"
                  value={item.id}
                  bind:checked={item.checked}
                  on:click={() => agregarRol(item.name, item.checked)}
                  class="cstm-switch-input" />
                <span class="cstm-switch-indicator bg-success bd-highlight" />
              </label>
            </div>
            {/each}

          </div>
        </form>

      </div>
    </div>
  </div>
</div>
