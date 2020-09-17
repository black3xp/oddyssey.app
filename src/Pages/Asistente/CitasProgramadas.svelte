<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
  import { connection, activePage, session, axios } from "../../store.js";
  import { UserManager } from "../../util.js";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import moment from "moment";
  import Swal from "sweetalert2";

  let user = {};
  user = new UserManager($session.authorizationHeader.Authorization)
  if (!user.isAny(['assistant', 'admin'])) {
    push('/Home/Unauthorized');
  }

  $axios.defaults.headers.common = {
    Authorization: $session.authorizationHeader.Authorization
  };
  $activePage = "citasProgramadas";

  onMount(() => {
    jQuery("#sltMedicos").select2();
    jQuery("#sltMedicos").on("select2:select", e => {
      let data = e.params.data;
      idMedico = data.id;
      
      cargarCitas();
      cargarCitasRealizadas();
    });

    cargarMedicos();
  });

  let citasPendientes = [];
  let citasRealizadas = [];
  let medicos = [];
  let idMedico = "";
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

  function cargarMedicos() {
    $axios.get("/MedicosAsistentes/" + user.nameid + "/Medicos")
      .then(res => {
        medicos = res.data;
      }).catch(err => {
        console.error(err);
      });
  }

  function cargarCitas() {
    $axios.get("/Medicos/Citas/" + idMedico)
      .then(res => {
        citasPendientes = res.data.filter(e => e.estadoID == 1);
      })
      .catch(err => {
        console.error(err);
      });
  }
  function cargarCitasRealizadas() {
    $axios.get("/Medicos/CitasRealizadas/" + idMedico)
      .then(res => {
        citasRealizadas = res.data;
      })
      .catch(err => {
        console.error(err);
      });
  }

</script>

<style>

</style>

<Aside />

<main class="admin-main">
  <Header />
  <section class="admin-content">
    <div class="container mt-3">
      <div class="col-md-12">
        <div class="row">

          <div class="col-md-12">
            <select class="form-control" id="sltMedicos" style="width: 100%">
              <option value={0} disabled selected>- Seleccionar -</option>
              {#each medicos as item}
                <option value={item.medicoID}>{item.name}</option>
              {/each}
            </select>
          </div>

          <div class="col-md-12 mt-2">
            <div class="alert alert-primary" role="alert">
              <h4 class="alert-heading">Consultas pendientes</h4>
              <h4 class:d-none={citasPendientes.length > 0}>No hay cita</h4>
              <div class="table-responsive">
                {#if citasPendientes.length > 0}
                  <table class="table align-td-middle table-card">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Celular</th>
                        <th>Observacion</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {#each citasPendientes as i}
                        <tr class="cursor-table">
                          <td>{i.nombrePaciente}</td>
                          <td />
                          <td>{i.observaciones}</td>
                          <td />
                          <td style="text-align: right;">
                            <button
                              class="btn btn-success btn-sm mb-1"
                              data-toggle="modal"
                              data-target="#modalPaciente">
                              <i class="mdi mdi-account-search-outline" />
                              Ver paciente
                            </button>
                            <button
                              class="btn btn-success btn-sm mb-1"
                              data-toggle="modal"
                              data-target="#modalCrearCita">
                              <i class="mdi mdi-calendar-remove" />
                              Reprogramar
                            </button>
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                {/if}
              </div>
            </div>
          </div>
          <div class="col-md-12">
            <div class="alert alert-secondary" role="alert">
              <h4 class="alert-heading">Consultas realizadas</h4>
              <h4 class:d-none={citasRealizadas.length > 0}>No hay cita</h4>
              <div class="table-responsive">
                {#if citasRealizadas.length > 0}
                  <table class="table align-td-middle table-card">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Celular</th>
                        <th>Observacion</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {#each citasRealizadas as i}
                        <tr class="cursor-table">
                          <td>{i.nombrePaciente}</td>
                          <td />
                          <td>{i.observaciones}</td>
                          <td />
                          <td style="text-align: right;">
                            <button
                              class="btn btn-success btn-sm mb-1"
                              data-toggle="modal"
                              data-target="#modalPaciente">
                              <i class="mdi mdi-account-search-outline" />
                              Ver paciente
                            </button>
                            <button
                              class="btn btn-success btn-sm mb-1"
                              data-toggle="modal"
                              data-target="#modalNuevaCita">
                              <i class="mdi mdi-calendar-remove" />
                              Crear cita
                            </button>
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
        <form id="frmPaciente">
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
        </form>
      </div>
      
    </div>
  </div>
</div>