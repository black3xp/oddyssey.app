<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
  import DiaSemana from "../../Components/DiaSemana.svelte";
  import { push } from "svelte-spa-router";
  import { activePage, dataCita, axios, session, errorConexion, toast } from "../../store";
  import { UserManager } from "../../util.js";
  import { onMount } from "svelte";
  import moment from 'moment';
  // import Swal from 'sweetalert2';

  let user = new UserManager($session.authorizationHeader.Authorization)

  $axios.defaults.headers.common = {
    Authorization: $session.authorizationHeader.Authorization
  };

  $activePage = "mantenimiento.peril";
  export let params = {};
  let idMedico = params.id;

  let medico = {
    medicoID: "",
    name: "",
    email: "",
    perfil: "",
    phoneNumber: "",
    ubicacion: ""
  };
  let usuario = {
    medicoID: "",
    name: "",
    email: "",
    perfilID: 0,
    phoneNumber: "",
    ubicacion: ""
  };
  
  let prefijos = [
    {value: 'Dr', name: 'Dr.'},
    {value: 'Dra', name: 'Dra.'},
    {value: 'Lic', name: 'Lic.'},
    {value: 'Lida', name: 'Lida.'},
    {value: 'Sr', name: 'Sr.'},
    {value: 'Sra', name: 'Sra.'},
  ]

  let fechaCita = "";
  let fechaBusquedaCita = "";
  let tandaID = 0;
  // let perfiles = [];
  let horarios = [];
  let tandas = [];
  let horasDisponibles = [];
  let citas = [];
  let filterCitas = [];
  let btnFechaDisponibilidad = 'h';
  let btnFechaCita = '';
  let cambioHorarioPermitido = false;

  let diasSemana = [
    {check: false, dia: 1, nombre: 'Lunes'},
    {check: false, dia: 2, nombre: 'Martes'},
    {check: false, dia: 3, nombre: 'Miercoles'},
    {check: false, dia: 4, nombre: 'Jueves'},
    {check: false, dia: 5, nombre: 'Viernes'},
    {check: false, dia: 6, nombre: 'Sabado'},
    {check: false, dia: 7, nombre: 'Domingo'},
  ];

  onMount(() => {
    btnFechaCita = 'semana';

    if ($dataCita.fechaCita == "" || $dataCita.fechaCita == undefined) {
      fechaCita = moment().format('YYYY-MM-DD');
      tandaID = 1;
    } else {
      fechaCita = $dataCita.fechaCita;
      tandaID = $dataCita.tandaID
    }

    cargarMedicosDelAsistente();
    cargarMedico();
    buscarDisponibilidadHorario();
    cargarHorarios();
    cargarTandas();
    cargarCitas();
    // cargarPerfiles();
  });

  function cargarMedicosDelAsistente() {
    $axios.get("/MedicosAsistentes/" + user.nameid + "/Medicos")
    .then(res => {
        cambioHorarioPermitido = res.data.some(x => x.medicoID == idMedico);
      }).catch(err => {
        console.error(err);
        $errorConexion()
      });
  }
  function cargarMedico() {
    $axios.get("/Medicos/" + idMedico)
    .then(res => {
        medico = res.data;
      }).catch(err => {
        console.error(err);
        $errorConexion()
      });
  }
  function cargarTandas() {
    $axios.get("/Tandas/GetAll")
    .then(res => {
        tandas = res.data;
      }).catch(err => {
        console.error(err);
        $errorConexion()
      });
  }
  function cargarHorarios() {
    $axios.get("/Medicos/Horarios/" + idMedico)
    .then(res => {
        horarios = res.data;

        diasSemana = diasSemana.map(e => {
          return {
            check: horarios.some(i => i.dia == e.dia && !i.inactivo),
            dia: e.dia,  // Numero del dia
            nombre: e.nombre // Si es Lunes, Martes, ETC.
          }
        });
      }).catch(err => {
        console.error(err);
        $errorConexion()
      });
  }
  function cargarCitas() {
    $axios.get("/Medicos/Citas/" + idMedico)
    .then(res => {
        let datosCita = res.data.map(x => {
          return {
            fecha: moment(x.fecha).format('LL'),
            hora: moment(x.fecha).format('LT'),
            observaciones: x.observaciones,
            nombrePaciente: x.nombrePaciente
          }
        });
        let diasUnicos = [...new Set( datosCita.map(e => { return e.fecha }) )]; // Eliminando dias repetidos
        diasUnicos.sort()

        citas = diasUnicos.map(e => {
          let horas = datosCita.filter(i => i.fecha == e).map(e => {
            return {
              hora:  moment(e.hora, 'LT'),
              nombrePaciente: e.nombrePaciente,
              observaciones: e.observaciones
            }
          });

          return {
            fecha: e,
            horas: horas.sort((e, i)=> e.hora - i.hora ).map(x => {
              return {
                hora : moment(x.hora).format('LT'),
                nombrePaciente: x.nombrePaciente,
                observaciones: x.observaciones
              }
            })
          }
        })
        filterCitas = citas;
        buscarCitas('semana');
      }).catch(err => {
        console.error(err);
        $errorConexion()
      });
  }
  // function cargarPerfiles() {
  //   $axios.get("/Perfiles/GetAll")
  //   .then(res => {
  //       perfiles = res.data;
  //     }).catch(err => {
  //       console.error(err);
  //       $errorConexion()
  //     });
  // }

  function buscarDisponibilidadHorario() {
    if (fechaCita == "" || tandaID <= 0) {
      horasDisponibles = [];
      return;
    }

    if (fechaCita == moment().format('YYYY-MM-DD')) {
      btnFechaDisponibilidad = 'h';
    } else if (fechaCita == moment().add(moment.duration(1, 'd')).format('YYYY-MM-DD')) {
      btnFechaDisponibilidad = 'm';
    } else {
      btnFechaDisponibilidad = ''
    }

    let params = "date=" + fechaCita + "&" + "tandiId=" + tandaID;
    $axios.get("/Medicos/HorasDisponibles/" + idMedico + "?" + params)
    .then(res => {
      horasDisponibles = res.data.map(e => {
        return {
          time : e,
          hora : moment(e, 'LT').format('LT')
        } 
      });
    }).catch(err => {
      horasDisponibles = [];
      console.error(err); 
      $errorConexion()
    })
  }

  function crearCita(hora) {
    $dataCita = {
      fechaCita: fechaCita,
      tandaID: tandaID,
      hora: hora,
      medicoId: idMedico,
      ubicacion: medico.ubicacion
    };
    push('/Cita/Crear/');
  }

  function diaSiguiente(params) {
    fechaCita = moment().add(moment.duration(1, 'd')).format('YYYY-MM-DD');
    btnFechaDisponibilidad = 'm';

    buscarDisponibilidadHorario();
  }
  function diaDeHoy(params) {
    fechaCita = moment().format('YYYY-MM-DD');
    btnFechaDisponibilidad = 'h';

    buscarDisponibilidadHorario();
  }
  function buscarCitas(tipoFecha) {
    let hoy = moment();
    btnFechaCita = tipoFecha;

    if (tipoFecha == 'hoy') {
      fechaBusquedaCita = hoy.format('YYYY-MM-DD');
      filterCitas = citas.filter(e => e.fecha == hoy.format('LL'));
    } else if (tipoFecha == 'manana') {
      hoy.add(moment.duration(1, 'd'));
      fechaBusquedaCita = hoy.format('YYYY-MM-DD')
      filterCitas = citas.filter(e => e.fecha == hoy.format('LL'));
    } else if (tipoFecha == 'semana') {
      fechaBusquedaCita = ''
      filterCitas = citas.filter(e => moment(e.fecha).format('W') == hoy.format('W'));
    } else {
      if (fechaBusquedaCita == hoy.format('YYYY-MM-DD')) {
        btnFechaCita = 'hoy';
      } else if (fechaBusquedaCita == hoy.add(moment.duration(1, 'd')).format('YYYY-MM-DD')) {
        btnFechaCita = 'manana';
      } else if (moment(fechaBusquedaCita).format('W') == hoy.format('W')) {
        btnFechaCita = 'semana'
      } else {
        btnFechaCita = ''
      }

      filterCitas = citas.filter(e => e.fecha == moment(fechaBusquedaCita).format('LL'));
    }
  }

  function editarUsuario() {
    $axios.get("/Users/" + idMedico)
    .then(res => {
      usuario = res.data;
      jQuery('#modalUsuario').modal('show');
    }).catch(err => {
      console.error(err);
      $errorConexion()
    });
  }
  function guardarUsuario() {
    $axios.put("/Users/" + idMedico, usuario)
    .then(res => {
        if (res.data.success) {
          $toast(5000).fire({
            icon: 'success',
            title: 'Medico actualizado con exito'
          })
          jQuery('#modalUsuario').modal('hide');
          cargarMedico();
        }
      }).catch(err => {
        console.error(err);
        $errorConexion()
      });
  }

</script>

<style>
  .list-group-item:nth-child(2n+1) {
    background-color: #3e46760c;
  }
  .list-group-item {
    padding: 5px 5px 5px 10px;
    border-right: 0;
    border-left: 0;
    border-radius: 0;
  }
  .list-group-item:first-child {
    border-top: none;
  }
  .list-group-item:last-child {
    border-bottom: none;
  }
  .card.card-vnc {
    box-shadow: none;
    border: #687ae8 solid 1px;
  }
  .btn-primary, .btn-write {
    border: 1px solid #d3e0e9;
  }
</style>

<Aside />

<main class="admin-main">
  <Header />
  <section class="admin-content">
    <div class="container mt-3">
      <h5 class="pt-2 pb-2">Perfil Medico</h5>
      <div class="row list">
        <div class="col-sm-12 col-lg-4">
          <div class="card m-b-30">
            <div class="card-header" />
            <div class="card-body">
              <div class="text-center">
                <div>
                  <div class="avatar avatar-xl avatar-online">
                    <img
                      class="avatar-img rounded-circle"
                      src="assets/img/users/user-5.jpg"
                      alt="name" />
                  </div>
                </div>
                <h3 class="p-t-10 searchBy-name">{medico.prefix} {medico.name}</h3>
              </div>
              <div class="text-muted text-center">
                {medico.perfil || ""}
              </div>
              <p class="text-muted text-center" style="margin-bottom: 0;">
                {medico.email}
              </p>
              <p class="text-muted text-center" style="margin-bottom: 0;">
                {medico.ubicacion || ""}
              </p>
              <p class="text-muted text-center">{medico.phoneNumber}</p>
              <div class="row text-center p-b-10">
                <div class="col">
                  <a
                    href="#!"
                    on:click|preventDefault={() => {
                      document
                        .querySelector('.horarioEspecialista')
                        .scrollIntoView({
                          behavior: 'smooth',
                          block: 'center'
                        });
                    }}>
                    <h3 class="mdi mdi-timetable"> </h3>
                    <div class="text-overline">Horario</div>

                  </a>
                </div>
                <div class="col">
                  <a href="#/" on:click|preventDefault={editarUsuario}>
                    <h3 class="mdi mdi-account-edit"> </h3>
                    <div class="text-overline">Editar Perfil</div>
                  </a>

                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-12 col-md-12 col-lg-8">
          <div class="card m-b-30">
            <div class="card-header">
              <h5 class="m-b-0">
                <i class="mdi mdi-calendar-search" />
                Disponibilidad
              </h5>
              <div class="card-controls">
                <div class="btn-group" role="group" aria-label="Basic example">
                  <button type="button" class:btn-primary={btnFechaDisponibilidad == 'h'} 
                    class:btn-write={btnFechaDisponibilidad != 'h'} class="btn shadow-none btn-sm" 
                    on:click={diaDeHoy}>
                    <i class="mdi mdi-calendar" />
                    Hoy
                  </button>
                  <button type="button" class:btn-primary={btnFechaDisponibilidad == 'm'}
                    class:btn-write={!btnFechaDisponibilidad != 'm'} class="btn shadow-none btn-sm"
                    on:click={diaSiguiente}>
                    Mañana
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body">

              <div class="row">
                <div class="col-lg-6">
                  <div class="form-group">
                    <label for="inputAddress">Fecha</label>
                    <input type="date" class="form-control form-control-sm"
                      bind:value={fechaCita} on:input={buscarDisponibilidadHorario}/>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group ">
                    <label class="font-secondary">Tanda</label>
                    <!-- svelte-ignore a11y-no-onchange -->
                    <select class="form-control form-control-sm js-select2"
                      bind:value={tandaID} on:change={buscarDisponibilidadHorario}>
                      <option value="0" disabled selected>- Seleccionar -</option>
                      {#each tandas as i}
                      <option value={i.id}>{i.nombre}</option>
                      {/each}
                    </select>
                  </div>
                </div>
              </div>
              {#if horasDisponibles.length <= 0}
              <div class="alert alert-success" role="alert">
                No hay disponibilidad con este horario
              </div>
              {/if}

              <div class="list-group list">
                {#each horasDisponibles as item}
                <div class="list-group-item d-flex align-items-center">
                  <div class="">
                    <div class="name">{item.hora}</div>
                  </div>
                  <div class="ml-auto">
                    <button
                      class="btn btn-outline-success btn-sm"
                      on:click={crearCita(item.time)}>
                      <i class="mdi mdi-calendar-plus"></i>
                      Crear cita
                    </button>
                  </div>
                </div>
                {/each}
              </div>

            </div>
          </div>

        </div>

        <div class="col-lg-12">
          <div class="card m-b-30">
            <div class="card-header">
              <h5 class="m-b-0">
                <i class="mdi mdi-calendar-multiselect" />
                Citas programadas
              </h5>
              <div class="card-controls">

                <div class="btn-group" role="group" aria-label="Basic example">
                  <input type="date" class="form-control form-control-sm"
                    bind:value={fechaBusquedaCita} on:change={() => buscarCitas('f')}/>
                  <button
                    type="button"
                    class:btn-primary={btnFechaCita == 'h'} class:btn-write={btnFechaCita != 'hoy'}
                    class="btn shadow-none btn-sm"
                    on:click={() => buscarCitas('hoy')}>
                    Hoy
                  </button>
                  <button
                    type="button"
                    class:btn-primary={btnFechaCita == 'm'} class:btn-write={btnFechaCita != 'm'}
                    class="btn shadow-none btn-sm"
                    on:click={() => buscarCitas('manana')}>
                    Mañana
                  </button>
                  <button
                    type="button"
                    class:btn-primary={btnFechaCita == 's'} class:btn-write={btnFechaCita != 's'}
                    class="btn shadow-none btn-sm"
                    on:click={() => buscarCitas('semana')}>
                    Semana
                  </button>
                </div>

              </div>
            </div>
            <div class="card-body">
              {#if filterCitas.length == 0}
              <div class="alert alert-success" role="alert">
                No hay citas programadas para este dia
              </div>
              {/if}

              <div class="row">
                {#each filterCitas as i}
                <div class="col-lg-6">
                  <div class="card m-b-20 card-vnc">
                    <div class="card-header">
                      <h5 class="m-b-0">{i.fecha}</h5>
                    </div>
                    <div class="card-body">
    
                      <div class="list-group list ">
                        {#each i.horas as h}
                        <div class="list-group-item d-flex align-items-center">
                          <div class="">
                            <div class="name text-primary">
                              {h.nombrePaciente}
                            </div>
                            <div class="text-muted">
                              <span>{h.hora}</span>
                              -
                              <span>{h.observaciones} (Observaciones)</span>
                            </div>
                          </div>
                        </div>
                        {/each}
                      </div>

                    </div>
                  </div>
                </div>
                {/each}
              </div>

            </div>
          </div>
          
          {#if user.is('assistant') && cambioHorarioPermitido || user.isAny(['admin', 'operator'])}
          <article class="card m-b-30 horarioEspecialista">
            <div class="card-header">
              <h5 class="m-b-0">
                <i class="mdi mdi-calendar-text" />
                Horario del especialista
              </h5>
            </div>
            <div class="card-body">
              {#each diasSemana as item}
              <DiaSemana on:cambioHorario={cargarHorarios} on:cambioHorario={buscarDisponibilidadHorario}
                {item} {tandas} {horarios} medicoID={idMedico} />
              {/each}
            </div>
          </article>
          {/if}
        </div>

      </div>
    </div>
  </section>
</main>

<form id="frmUsuario" on:submit|preventDefault={guardarUsuario}>
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
                  bind:value={usuario.prefix} required>
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
                  bind:value={usuario.name}
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
                  bind:value={usuario.email}
                  autocomplete="off"
                  name="Email"
                  id="txtCorreo"
                  maxlength="100" />
              </div>
            </div>

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
                  bind:value={usuario.phoneNumber}/>
              </div>
              <div class="form-group col-md-12">
                <label for="">Ubicacion</label>
                <input
                  type="text"
                  class="form-control"
                  autocomplete="off"
                  bind:value={usuario.ubicacion}/>
              </div>

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
