<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
  import { push } from "svelte-spa-router";
  import { onMount } from "svelte";
  import { activePage, dataCita, axios, session, errorConexion } from "../../store";
  import moment from 'moment';
  import Swal from 'sweetalert2';

  $axios.defaults.headers.common = {
    Authorization: $session.authorizationHeader.Authorization
  };

  let ubicacion = "";
  let diaSeleccion = -1;
  let especialidades = [];
  let medicos = [];
  let tandas = [];
  let horasDisponibles = [];

  let filterCitaMedico = {
    Nombre: "",
    PerfilID: 0,
    FechaCita: "",
    TandaID: 0
  }
  let filterCita = {
    MedicoId: "",
    FechaCita: "",
    TandaID: 0
  }
  if ($activePage == 'citas.crear') {
    limpiarFiltro();
  }

  $activePage = "gestor"

  onMount(() => {
    if ($dataCita.fechaCita != undefined) {
      filterCitaMedico.FechaCita = $dataCita.fechaCita;
      filterCitaMedico.TandaID = $dataCita.tandaID
    }

    jQuery("#sltEspecialidad").select2();
    jQuery("#sltEspecialidad").on("select2:select", e => {
      let data = e.params.data;
      filterCitaMedico.PerfilID = parseInt(data.id);
      filtrar('general');
    });

    marcarFecha();
    cargarMedicos();
    cargarEspecialidades();
    cargarTandas();
  });

  function cargarMedicos() {
    var qs = new URLSearchParams(filterCitaMedico).toString()
    $axios.get("/Medicos/Query?" + qs)
    .then(res => {
      medicos = res.data;
    }).catch(err => {
      $errorConexion()
    });
  }
  function cargarEspecialidades() {
    $axios.get("/Perfiles/GetAll")
    .then(res => {
      especialidades = res.data;
    }).catch(err => {
      $errorConexion()
    });
  }
  function cargarTandas() {
    $axios.get("/Tandas/GetAll")
    .then(res => {
      tandas = res.data;
    }).catch(err => {
      $errorConexion()
    });
  }
  function buscarDisponibilidadHorario(idMedico) {
    if (typeof idMedico === 'string') {
      filterCita.MedicoId = idMedico;
    }

    if (filterCita.FechaCita == "") {
      horasDisponibles = [];
      return;
    }

    let params = "date=" + filterCita.FechaCita + "&" + "tandiId=" + filterCita.TandaID;
    $axios.get("/Medicos/HorasDisponibles/" + filterCita.MedicoId + "?" + params)
    .then(res => {
      horasDisponibles = res.data.map(e => {
        return {
          time : e,
          hora : moment(e, 'LT').format('LT')
        }
      });
    }).catch(err => {
      horasDisponibles = [];
      $errorConexion()
    })
  }

  function elegirTiempo(e) {
    let countDia = parseInt(e.target.value);
    let date = moment();
    date.add(moment.duration(countDia, 'd'));

    filterCitaMedico.FechaCita = date.format('YYYY-MM-DD');
    cargarMedicos();
  }
  function crearCita(item) {
    ubicacion = item.ubicacion;
    filterCita.TandaID = filterCitaMedico.TandaID;
    filterCita.FechaCita = filterCitaMedico.FechaCita || moment().format('YYYY-MM-DD');
    buscarDisponibilidadHorario(item.id)

    jQuery('#modalCrearCita').modal('show')
  }
  function irACita(time) {
    $dataCita = {
      fechaCita: filterCita.FechaCita,
      tandaID: filterCita.TandaID,
      hora: time,
      medicoId: filterCita.MedicoId,
      pacienteId: "",
      ubicacion: ubicacion
    };
    push('/Cita/Crear');
  }
  function irAlPerfil(id) {
    $dataCita = {
      fechaCita: filterCitaMedico.FechaCita,
      tandaID: filterCitaMedico.TandaID,
      hora: "",
      medicoId: id,
      pacienteId: ""
    };
    push('/Medico/Perfil/' + id);
  }
  function filtrar(tipo) {
    if (tipo == 'limpiar') {
      diaSeleccion = -1;
    }
    if (tipo == 'fecha') {
      marcarFecha()
    }

    cargarMedicos();
  }
  function marcarFecha() {
    if (filterCitaMedico.FechaCita == moment().format('YYYY-MM-DD')) {
      diaSeleccion = 0;
    } else if (filterCitaMedico.FechaCita == moment().add(moment.duration(1, 'd')).format('YYYY-MM-DD')) {
      diaSeleccion = 1;
    } else if (filterCitaMedico.FechaCita == moment().add(moment.duration(2, 'd')).format('YYYY-MM-DD')) {
      diaSeleccion = 2;
    } else {
      diaSeleccion = -1;
    }
  }
  function limpiarFiltro() {
    filterCitaMedico.Nombre = "";
    filterCitaMedico.PerfilID = 0;
    filterCitaMedico.FechaCita = "";
    filterCitaMedico.TandaID = 0;
    $dataCita = {}

    jQuery("#sltEspecialidad").val(0).trigger('change');
    filtrar('limpiar');
  }
</script>

<style>
  .option-box label:after,
  .option-box label:before {
    top: 0;
  }
</style>

<Aside />

<main class="admin-main">
  <Header />
  <section class="admin-content">
    <div class="container-fluid mt-3">
      <h4>Gestión de citas</h4>
      <div class="row">
        <div class="col-lg-4">
          <div class="card">
            <div class="card-body">
              <div class="form-group ">
                <label class="font-secondary">Médico</label>
                <input type="text" class="form-control" bind:value={filterCitaMedico.Nombre} on:input={() => filtrar('medico')} />
              </div>
              <div class="form-group ">
                <label class="font-secondary">Especialidad</label>
                <!-- svelte-ignore a11y-no-onchange -->
                <select class="form-control select2" style="width: 100%;" id="sltEspecialidad"
                  bind:value={filterCitaMedico.PerfilID} on:change={() => filtrar('especialidad')}>
                  <option value={0}>Todas</option>
                  {#each especialidades as item}
                  <option value={item.id}>{item.nombre}</option>
                  {/each}
                </select>
              </div>
              <div class="form-group">
                <label for="inputAddress2">Fecha</label>
                <input
                  type="date"
                  class="form-control mb-2"
                  id="inputAddress2" 
                  bind:value={filterCitaMedico.FechaCita} on:input={() => filtrar('fecha')}/>

                <div class="contenedor-dias">
                  <div class="option-box">
                    <input id="radio-new1" name="tiempo" type="radio" 
                      value={0} on:change={elegirTiempo} bind:group={diaSeleccion} />
                    <label
                      for="radio-new1"
                      style="height: 40px; padding: 3px 10px;">
                      <span class="radio-content">
                        <span class="h6 d-block">Hoy</span>
                      </span>
                    </label>
                  </div>
                  <div class="option-box">
                    <input id="radio-new2" name="tiempo" type="radio" 
                      value={1} on:change={elegirTiempo} bind:group={diaSeleccion} />
                    <label
                      for="radio-new2"
                      style="height: 40px; padding: 3px 10px;">
                      <span class="radio-content">
                        <span class="h6 d-block">Mañana</span>
                      </span>
                    </label>
                  </div>
                  <div class="option-box">
                    <input id="radio-new3" name="tiempo" type="radio" 
                      value={2} on:change={elegirTiempo} bind:group={diaSeleccion} />
                    <label
                      for="radio-new3"
                      style="height: 40px; padding: 3px 10px;">
                      <span class="radio-content">
                        <span class="h6 d-block">En dos días</span>
                      </span>
                    </label>
                  </div>
                </div>

              </div>

              <div class="form-group ">
                <label class="font-secondary">Tanda</label>
                <!-- svelte-ignore a11y-no-onchange -->
                <select class="form-control" bind:value={filterCitaMedico.TandaID} 
                  on:change={() => filtrar('tanda')}>
                  <option value={0} selected>Todas</option>
                  {#each tandas as item}
                  <option value={item.id}>{item.nombre}</option>
                  {/each}
                </select>
              </div>
              <button on:click={limpiarFiltro} class="btn btn-secondary btn-block">Limpiar</button>
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="table-responsive">
            <table class="table align-td-middle table-card">
              <thead>
                <tr>
                  <th />
                  <th>Nombre</th>
                  <th>Especialidad</th>
                  <th>Telefono</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {#each medicos as item}
                  <!-- content here -->
                  <tr>
                    <td>
                      <div class="avatar avatar-sm ">
                        <img
                          src="assets/img/products/item%20(1).jpg"
                          class="avatar-img avatar-sm rounded-circle"
                          alt="" />
                      </div>
                    </td>
                    <td>{item.name}</td>
                    <td>{item.perfil}</td>
                    <td>{item.phoneNumber}</td>
                    <td style="text-align: right;">
                      <button class="btn btn-outline-primary btn-sm"
                        on:click={() => irAlPerfil(item.id)}>
                        <i class="mdi mdi-contacts" />
                        Perfil
                      </button>
                      <button class="btn btn-outline-success btn-sm" 
                        on:click={() => crearCita(item)}>
                        <i class="mdi mdi-calendar-plus" />
                        Crear cita
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<div
  class="modal fade modal-slide-right"
  id="modalCrearCita"
  tabindex="-1"
  role="dialog"
  aria-labelledby="modalCrearCitaLabel"
  style="display: none; padding-right: 16px;"
  aria-modal="true">
  <div class="modal-dialog" role="document" >
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalCrearCitaLabel">
          <i class="mdi mdi-calendar-plus"></i>
          Crear cita
        </h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div class="modal-body" style="height: 100%; top: 0; overflow: auto;">

        <div class="row">
          <div class="col-lg-6">
            <div class="form-group">
              <label for="inputAddress">Fecha</label> 
              <input type="date" class="form-control form-control-sm"
                bind:value={filterCita.FechaCita} on:change={buscarDisponibilidadHorario}>
            </div>
          </div> 
          <div class="col-lg-6">
            <div class="form-group ">
              <label class="font-secondary">Tanda</label>
              <!-- svelte-ignore a11y-no-onchange -->
              <select class="form-control form-control-sm"
                bind:value={filterCita.TandaID} on:change={buscarDisponibilidadHorario}>
                <option value={0} disabled>- Seleccionar -</option>
                {#each tandas as i}
                <option value={i.id}>{i.nombre}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>  
        <div class="list-group list">
          {#if horasDisponibles.length <= 0}
            <div class="alert alert-success" role="alert">
              No hay disponibilidad con este horario
            </div>
          {/if}
          {#each horasDisponibles as i}
          <div class="list-group-item d-flex align-items-center svelte-1nu1nbu">
            <div class="">
              <div class="name">{i.hora}</div>
            </div>
            <div class="ml-auto">
              <button class="btn btn-outline-success btn-sm"
                on:click={() => irACita(i.time)}>Seleccionar</button>
            </div>
          </div>
          {/each}
        </div>

      </div>
    </div>
  </div>
</div>