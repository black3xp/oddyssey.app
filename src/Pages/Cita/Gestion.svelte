<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
  import { push } from "svelte-spa-router";
  import { onMount } from "svelte";
  import { activePage, host, dataCita } from "../../store";
  import axios from "axios";
  import moment from 'moment';

  let filter = {
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

  let busqueda = "";
  let especialidades = [];
  let listado = [];
  let tandas = [];
  let horasDisponibles = [];

  onMount(() => {
    if ($dataCita.fechaCita != undefined) {
      filter.FechaCita = $dataCita.fechaCita;
      filter.TandaID = $dataCita.tandaID
    }

    jQuery("#sltEspecialidad").select2();
    jQuery("#sltEspecialidad").on("select2:select", e => {
      let data = e.params.data;
      filter.PerfilID = parseInt(data.id);
      filtrar();
    });

    cargarMedicos();
    cargarEspecialidades();
    cargarTandas();
  });

  function cargarMedicos() {
    var qs = Object.keys(filter).map(i => i + '=' + filter[i]).join('&');
    axios.get($host + "/Medicos/Query?" + qs, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      listado = res.data;
    }).catch(err => {
      console.error(err);
    });
  }
  function cargarEspecialidades() {
    axios.get($host + "/Perfiles/GetAll", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      especialidades = res.data;
    }).catch(err => {
      console.error(err);
    });
  }
  function cargarTandas() {
    axios.get($host + "/Tandas/GetAll", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      tandas = res.data;
    }).catch(err => {
      console.error(err);
    });
  }
  function elegirTiempo(e) {
    let dia = parseInt(e.target.value);
    let hoy = moment();
    hoy.add(moment.duration(dia, 'd'));

    filter.FechaCita = hoy.format('YYYY-MM-DD');
    cargarMedicos();
  }
  function crearCita(id) {
    $dataCita = {
      fechaCita: filter.FechaCita,
      tandaID: filter.TandaID,
      hora: "",
      medicoId: id
    };
    push('/Cita/Crear');
  }
  function irAlPerfil(id) {
    $dataCita = {
      fechaCita: filter.FechaCita,
      tandaID: filter.TandaID,
      hora: "",
      medicoId: id
    };
    push('/Medico/Perfil/' + id);
  }

  function filtrar() {
    if (filter.FechaCita == "" || filter.FechaCita == undefined) {
      let tiempos = Array.from(document.getElementsByName('tiempo'));
      tiempos.forEach(x => {
        if (x.checked) {
          x.checked = false;
        }
      })
    }

    cargarMedicos();
  }
  function limpiarFiltro() {
    filter = {
      Nombre: "",
      PerfilID: 0,
      FechaCita: "",
      TandaID: 0
    }

    jQuery("#sltEspecialidad").val(0).trigger('change');
    filtrar();
  }
  function buscarDisponibilidadHorario(idMedico) {
    if (typeof idMedico === 'string') {
      filterCita.MedicoId = idMedico;
    }

    if (filterCita.FechaCita == "" || filterCita.TandaID <= 0) {
      horasDisponibles = [];
      return;
    }

    let params = "date=" + filterCita.FechaCita + "&" + "tandiId=" + filterCita.TandaID;
    axios.get($host + "/Medicos/HorasDisponibles/" + filterCita.MedicoId + "?" + params, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      horasDisponibles = res.data;
    }).catch(err => {
      horasDisponibles = [];
      console.error(err);
    })
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
                <input type="text" class="form-control" bind:value={filter.Nombre} on:input={filtrar} />
              </div>
              <div class="form-group ">
                <label class="font-secondary">Especialidad</label>
                <select class="form-control select2" style="width: 100%;" id="sltEspecialidad"
                  bind:value={filter.PerfilID} on:change={filtrar}>
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
                  bind:value={filter.FechaCita} on:input={filtrar}/>

                <div class="contenedor-dias">
                  <div class="option-box">
                    <input id="radio-new1" name="tiempo" type="radio" 
                      value={0} on:change={elegirTiempo} />
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
                      value={1} on:change={elegirTiempo} />
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
                      value={2} on:change={elegirTiempo} />
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
                <select class="form-control" bind:value={filter.TandaID} on:change={filtrar}>
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
                {#each listado as item}
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
                        on:click={irAlPerfil(item.id)}>
                        <i class="mdi mdi-contacts" />
                        Perfil
                      </button>
                      <button class="btn btn-outline-success btn-sm" on:click={crearCita(item.id)}>
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
              <select class="form-control form-control-sm"
                bind:value={filterCita.TandaID} on:change={buscarDisponibilidadHorario}>
                <option value={0} disabled="">- Seleccionar -</option>
                <option value={1}>Matutina</option>
                <option value={2}>Vespertina</option>
              </select>
            </div>
          </div>
        </div>  
        <div class="list-group list">
          {#each horasDisponibles as i}
          <div class="list-group-item d-flex align-items-center svelte-1nu1nbu">
            <div class="">
              <div class="name">{i}</div>
            </div>
            <div class="ml-auto">
              <button class="btn btn-outline-success btn-sm">Seleccionar</button>
            </div>
          </div>
          {/each}
        </div>

      </div>
    </div>
  </div>
</div>