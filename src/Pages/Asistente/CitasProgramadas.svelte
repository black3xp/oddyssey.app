<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
  import { activePage, session, axios, dataCita, errorConexion, toast }
    from "../../store.js";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import moment from "moment";
  // import Swal from "sweetalert2";

  $axios.defaults.headers.common = {
    Authorization: $session.authorizationHeader.Authorization
  };
  $activePage = "citasProgramadas";

  onMount(() => {
    moment.locale('es-DO');
    jQuery("#sltMedicos").select2();
    jQuery("#sltMedicos").on("select2:select", e => {
      let data = e.params.data;
      idMedico = data.id;
      cargarCitas()
    });

    cargarEstados();
    cargarMedicos();
    cargarCitas();
  });

  let horasDisponibles = [];
  let citasPendientes = [];
  let citasRealizadas = [];
  let medicos = [];
  let estados = [];
  let idMedico = "";
  let fecha = "";
  let tandaID = 0;
  let paciente = {
    id: "",
    nombre: "",
    apellido: "",
    cedula: "",
    correo: "",
    telefono: "",
    aseguradoraID: 0,
    nombreAseguradora: "",
    provinciaID: 0,
    nacionalidad: "",
    noAfiliado: "",
    sexo: "",
    direccion: "",
    observaciones: ""
  };
  let cita = {
    id: 0,
    medicoID: "",
    pacienteID: "",
    aseguradoraID: 0,
    estadoID: 1,
    fecha: "",
    observaciones: "",
    inactivo: false,
  };
  let filter = {
    medicoID: "",
    fechaInicio : "",
    fechaFin : "",
    estadoID : "",
    nombrePaciente : ""
  }
  let provincias = [
    { id: 1, nombre: "Duarte" },
    { id: 2, nombre: "Santiago" },
    { id: 3, nombre: "Distrito Nacional" }
  ];
  let aseguradoras = [
    { id: 1, nombre: "SENASA" },
    { id: 2, nombre: "HUMANO SEGURO" },
    { id: 3, nombre: "RENACER" },
    { id: 4, nombre: "PALIC" },
    { id: 5, nombre: "FUTURO" }
  ];
  function colorEstado(code) {
    if (code == 'p') {
      return 'badge-secondary';
    }
    if (code == 't') {
      return 'badge-primary';
    }
    if (code == 'r') {
      return 'badge-success';
    }
    if (code == 'a') {
      return 'badge-danger';
    }
  }

  function cargarMedicos() {
    $axios.get("/Medicos/Query?")
      .then(res => {
        medicos = res.data;
      }).catch(err => {
        $errorConexion()
      });
  }
  function cargarEstados() {
    $axios.get("/Citas/Estados")
      .then(res => {
        estados = res.data;
      }).catch(err => {
        $errorConexion()
      });
  }

  function cargarCitas() {
    filter.medicoID = idMedico;

    let qs = new URLSearchParams(filter).toString()
    $axios.get("/Medicos/CitasFiltrada?" + qs)
      .then(res => {
        citasPendientes = res.data;
      })
      .catch(err => {
        $errorConexion()
      });
  }
  function cargarDatosPaciente(item) {
    $axios.get("/Pacientes/" + item.pacienteID)
      .then(res => {
        paciente = res.data;
      })
      .catch(err => {
        $errorConexion()
      });
  }
  function buscarDisponibilidadHorario() {
    if (fecha == "" || tandaID <= 0) {
      horasDisponibles = [];
      return;
    }

    let params = "date=" + fecha + "&" + "tandiId=" + tandaID;
    $axios.get("/Medicos/HorasDisponibles/" + idMedico + "?" + params)
      .then(res => {
        horasDisponibles = res.data.map(x => {
          return {
            time: x,
            hora: moment(x, "LT").format("LT") // asignando fecha con formato hora
          };
        });
      })
      .catch(err => {
        horasDisponibles = [];
        $errorConexion()
      });
  }
  function reprogramarCita(item) {
    cita = item;
    if (fecha == "" || tandaID <= 0) {
      fecha = moment().format("YYYY-MM-DD"); // asignando fecha de hoy con un formato especifico
      tandaID = 1;
    }

    buscarDisponibilidadHorario();
  }

  function guardarPaciente() {
    if (paciente.aseguradoraID > 0) {
      paciente.nombreAseguradora = aseguradoras.find(e => e.id == paciente.aseguradoraID).nombre;
    }

    $axios.put("/Pacientes/" + paciente.id, paciente)
      .then(res => {
        if (res.data.success) {
          $toast(5000).fire({
            icon: 'success',
            title: 'Paciente actualizado con exito'
          })
          
          jQuery("#modalPaciente").modal("hide");
        }
      }).catch(err => {
        $errorConexion()
      });
  }
  function cambiarFechaCita(hora) {
    cita.fecha = fecha + "T" + hora;
    cita.estadoID = 1;
    cita.inactivo = false;

    $axios.put("/Citas/" + cita.id, cita)
      .then(res => {
        if (res.data.success) {
          $toast(5000).fire({
            icon: 'success',
            title: 'Cambio de cita realizado con exito'
          })
          cargarCitas()
          jQuery("#modalCrearCita").modal("hide");
        }
      })
      .catch(err => {
        $errorConexion()
      });
  }

  function irACita(time) {
    $dataCita = {
      fechaCita: fecha,
      tandaID: tandaID,
      hora: time,
      medicoId: idMedico,
      pacienteId: cita.pacienteID
    };
    push('/Cita/Crear');
  }
  
  function btnFiltro() {
    jQuery("#filtroAvanzado").slideToggle(500);
  }

</script>

<style>
  .modal-slide-right {
    top: 0;
    bottom: 0;
  }

  .modal-slide-right .modal-dialog {
    height: 100% !important;
    top: 0;
    position: fixed !important;
  }

  .modal-slide-right .modal-body {
    height: 100% !important;
    top: 0;
    overflow: auto;
  }
</style>

<Aside />

<main class="admin-main">
  <Header />
  <section class="admin-content">
    <div class="container mt-3">
      <div class="col-md-12">
        <div class="row">

          <div class="col-lg-6 mt-2">
            <input type="text" class="form-control" placeholder="Buscar paciente"
             bind:value={filter.nombrePaciente} on:input={cargarCitas}>
          </div>
          <div class="col-lg-4 mt-2">
            <select class="form-control" id="sltMedicos" style="width: 100%">
              <option value={0} disabled selected>- Seleccionar medico -</option>
              <option value={""}>Todos</option>
              {#each medicos as item}
                <option value={item.id}>{item.name}</option>
              {/each}
            </select>
          </div>
          <div class="col-lg-2">
            <button class="btn btn-primary" id="btnFiltro" on:click={btnFiltro} style="margin-top: 8px;">Filtros</button>
          </div>
          <div id="filtroAvanzado" class="col-lg-12 mt-2" style="display: none;">
              <div class="alert alert-secondary">
                <div class="row">
                  <div class="col-lg-6 col-md-6">
                    <label>Estados</label>
                    <!-- svelte-ignore a11y-no-onchange -->
                    <select class="form-control" bind:value={filter.estadoID} on:change={cargarCitas}>
                      <option value="" disabled selected>- Buscar por estado -</option>
                      <option value={0}>Todos</option>
                      {#each estados as item}
                        <option value={item.id}>{item.nombre}</option>
                      {/each}
                    </select>
                  </div>
                  <div class="col-lg-3 col-md-3">
                    <label>Desde</label>
                    <input type="date" class="form-control" bind:value={filter.fechaInicio} on:input={cargarCitas}>
                  </div>
                  <div class="col-lg-3 col-md-3">
                    <label>Hasta</label>
                    <input type="date" class="form-control" bind:value={filter.fechaFin} on:input={cargarCitas}>
                  </div>
                </div>
              </div>
          </div>

          <div class="col-md-12 mt-2">
            <div class="alert alert-primary" role="alert">
                
              <h4 class:d-none={citasPendientes.length > 0}>No hay cita</h4>
              <div class="table-responsive">
                {#if citasPendientes.length > 0}
                  <table class="table align-td-middle table-card">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {#each citasPendientes as i}
                        <tr class="cursor-table">
                          <td>{i.nombrePaciente}</td>
                          <td>
                            <span class="badge {colorEstado(i.codigoEstado)}">{i.nombreEstado}</span>
                          </td>
                          <td>{moment(i.fecha).format('LLL')}</td>
                          <td />
                          <td style="text-align: right;">
                            <button
                              class="btn btn-success btn-sm mb-1"
                              data-toggle="modal"
                              data-target="#modalPaciente"
                              on:click={() => cargarDatosPaciente(i)}>
                              <i class="mdi mdi-account-search-outline" />
                              Ver paciente
                            </button>
                            {#if idMedico != ""}
                            <button
                              class="btn btn-success btn-sm mb-1"
                              data-toggle="modal"
                              data-target={i.codigoEstado == 'r' ? '#modalNuevaCita' : '#modalCrearCita'}
                              on:click={() => reprogramarCita(i)}>
                              <i class="mdi mdi-calendar-remove" />
                              {i.codigoEstado == 'r' ? 'Crear cita' : 'Reprogramar'}
                            </button>
                            {/if}
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                {/if}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</main>

<form id="frmPaciente" on:submit|preventDefault={guardarPaciente}>
<div
  class="modal fade modal-slide-right"
  id="modalPaciente"
  tabindex="-1"
  role="dialog"
  aria-labelledby="modalPacienteLabel"
  style="display: none; padding-right: 16px;"
  aria-modal="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalPacienteLabel">
          <i class="mdi mdi-account-search-outline" />
          Paciente
        </h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div class="modal-body">
          <input type="hidden" name="IdUser" value="0" />
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Nombre</label>
              <input
                type="name"
                class="form-control"
                name="Name"
                maxlength="200"
                required
                bind:value={paciente.nombre} />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Apellido</label>
              <input
                type="name"
                class="form-control"
                name="Name"
                maxlength="200"
                required
                bind:value={paciente.apellidos} />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Cedula</label>
              <input
                type="name"
                class="form-control"
                name="Name"
                maxlength="200"
                bind:value={paciente.cedula} />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Telefono</label>
              <input
                type="tel"
                class="form-control"
                name="Name"
                maxlength="200"
                required
                bind:value={paciente.telefono} />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Correo electronico</label>
              <input
                type="email"
                class="form-control"
                name="Name"
                maxlength="200"
                bind:value={paciente.correo}/>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Aseguradora</label>
              <select
                class="form-control js-select2"
                bind:value={paciente.aseguradoraID}>
                <option value="0" disabled selected>- Seleccionar -</option>
                {#each aseguradoras as item}
                  <option value={item.id}>{item.nombre}</option>
                {/each}
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">No. Seguro</label>
              <input
                type="text"
                class="form-control"
                name="Name"
                maxlength="200"
                bind:value={paciente.noAfiliado} />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Pais</label>
              <select class="form-control js-select2" bind:value={paciente.nacionalidad}>
                <option value="0" disabled selected>- Seleccionar -</option>
                <option value={"Rep. Dom."}>Rep. Dom.</option>
                <option value={"Haiti"}>Haiti</option>
                <option value={"Venezuela"}>Venezuela</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Provincia</label>
              <select
                class="form-control js-select2"
                bind:value={paciente.provinciaID}>
                <option value="0" disabled selected>- Seleccionar -</option>
                {#each provincias as item}
                  <option value={item.id}>{item.nombre}</option>
                {/each}
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Direccion</label>
              <textarea
                class="form-control"
                rows="2"
                bind:value={paciente.direccion} />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Observaciones</label>
              <textarea
                class="form-control"
                rows="3"
                bind:value={paciente.observaciones} />
            </div>
          </div>

          <br />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-danger"
            data-dismiss="modal">
            Cerrar
          </button>
          <button type="submit" class="btn btn-outline-primary">
            Guardar
            <i class="mdi mdi-content-save-outline" />
          </button>
        </div>
        
      </div>
    </div>
  </div>
</form>

<div
  class="modal fade modal-slide-right"
  id="modalCrearCita"
  tabindex="-1"
  role="dialog"
  aria-labelledby="modalCrearCitaLabel"
  style="display: none; padding-right: 16px;"
  aria-modal="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalCrearCitaLabel">
          <i class="mdi mdi-calendar-plus" />
          Reprogramacion de cita
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
              <input
                type="date"
                class="form-control form-control-sm"
                bind:value={fecha}
                on:change={buscarDisponibilidadHorario} />
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group ">
              <label class="font-secondary">Tanda</label>
              <!-- svelte-ignore a11y-no-onchange -->
              <select
                class="form-control form-control-sm js-select2"
                bind:value={tandaID}
                on:change={buscarDisponibilidadHorario}>
                <option value={0} disabled>- Seleccionar -</option>
                <option value={1}>Matutina</option>
                <option value={2}>Vespertina</option>
              </select>
            </div>
          </div>
        </div>
        <div class="list-group list">
          {#if horasDisponibles.length <= 0}
            <div class="alert alert-success" role="alert">
              No hay disponibilidad en este horario
            </div>
          {/if}
          {#each horasDisponibles as i}
            <div
              class="list-group-item d-flex align-items-center svelte-1nu1nbu">
              <div class="">
                <div class="name">{i.hora}</div>
              </div>
              <div class="ml-auto">
                <button
                  on:click={cambiarFechaCita(i.time)}
                  class="btn btn-outline-success btn-sm">
                  Seleccionar
                </button>
              </div>
            </div>
          {/each}
        </div>

      </div>
    </div>
  </div>
</div>

<div
  class="modal fade modal-slide-right"
  id="modalNuevaCita"
  tabindex="-1"
  role="dialog"
  aria-labelledby="modalNuevaCitaLabel"
  style="display: none; padding-right: 16px;"
  aria-modal="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalNuevaCitaLabel">
          <i class="mdi mdi-calendar-plus" />
          Creacion de cita
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
              <input
                type="date"
                class="form-control form-control-sm"
                bind:value={fecha}
                on:change={buscarDisponibilidadHorario} />
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group ">
              <label class="font-secondary">Tanda</label>
              <!-- svelte-ignore a11y-no-onchange -->
              <select
                class="form-control form-control-sm js-select2"
                bind:value={tandaID}
                on:change={buscarDisponibilidadHorario}>
                <option value={0} disabled>- Seleccionar -</option>
                <option value={1}>Matutina</option>
                <option value={2}>Vespertina</option>
              </select>
            </div>
          </div>
        </div>
        <div class="list-group list">
          {#if horasDisponibles.length <= 0}
            <div class="alert alert-success" role="alert">
              No hay disponibilidad en este horario
            </div>
          {/if}
          {#each horasDisponibles as i}
            <div
              class="list-group-item d-flex align-items-center svelte-1nu1nbu">
              <div class="">
                <div class="name">{i.hora}</div>
              </div>
              <div class="ml-auto">
                <button
                  on:click={() => irACita(i.time)}
                  class="btn btn-outline-success btn-sm">
                  Seleccionar
                </button>
              </div>
            </div>
          {/each}
        </div>

      </div>
    </div>
  </div>
</div>