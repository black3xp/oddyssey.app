<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
  import { connection, activePage, session, axios } from "../../store.js";
  import { UserManager } from "../../util.js";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import moment from "moment";
  
  let user = {};
  user = new UserManager($session.authorizationHeader.Authorization)
  if (!user.isAny(['doctor', 'admin'])) {
    push('/Home/Unauthorized');
  }

  $axios.defaults.headers.common = {
    Authorization: $session.authorizationHeader.Authorization
  };

  $activePage = "espacioMedico";
  let paciente = {};
  let citaActual = {};
  let citas = [];

  onMount(() => {
    cargarPacientesActivos()
  })

  $connection.on("RecibirPaciente", cita => {
    citaActual = cita
    cargarPacientesActivos();
  });

  function cargarPacientesActivos() {
    $axios.get('/Medicos/' + user.nameid + "/PacientesActivos")
    .then(res => {
      citas = res.data.filter (e =>
        moment(e.fecha).format("YYYY-MM-DD") ==
        moment().format("YYYY-MM-DD")
      );
      if (Object.entries(citaActual).length != 0) {
        getPaciente(citaActual)
      }
    }).catch(err => {
      console.error(err);
    })
  }
  function getPaciente(cita) {
    citaActual = cita
    $axios.get("/Pacientes/" + cita.pacienteID)
      .then(res => {
        paciente = res.data;
      }).catch(err => {
        console.error(err);
      });
  }
  function terminarCita() {
    if (Object.entries(citaActual).length > 0) {
      citaActual.estadoID = 3;
      $axios.put("/Citas/" + citaActual.id, citaActual)
      .then(res => {
        if (res.data.success) {
          citaActual = {}
          paciente = {}
          cargarPacientesActivos();

          $connection.invoke("EnviarAvisoDelPaciente", user.nameid)
            .catch(err => console.error(err));
        }
      })
      .catch(err => {
        console.error(err);
      });
    }
  }
</script>

<style>
  .list-group-item {
    border-radius: 0 !important;
  }
  .list-group-item:last-child {
    border-bottom: none;
  }
  .list-group-item.activo {
    background-color: #687ae8;
    color: white;
    border-radius: 3px !important;
  }
  .list-group-item.activo .text-muted {
    color: white !important;
  }
</style>

<Aside />

<main class="admin-main">
  <Header />
  <section class="admin-content">
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 mb-3" style="text-align: right;">
          <!-- <button type="submit" class="btn btn-primary">
            <i class="mdi mdi-bell-ring-outline" />
            Llamar asistente
          </button> -->
          <button class:d-none={Object.entries(citaActual).length == 0} class="btn btn-success"
            on:click={terminarCita}>
            <i class="mdi mdi-check-all" />
            Terminar cita
          </button>
        </div>
        <div class="col-lg-5">
          <div class="card m-b-20 card-vnc svelte-1e95eny">
            <div class="card-header">
              <h5 class="m-b-0">Lista de citas</h5>
            </div>
            <div class="card-body">
              <div class="list-group list ">
                {#each citas as item}
                <div
                  class="list-group-item d-flex align-items-center
                  link-pacientes svelte-1p1f2vm" class:activo={citaActual.pacienteID == item.pacienteID}
                  style="cursor: pointer;"
                  on:click={() => { getPaciente(item) }}>
                  <div class="row">
                    <div class="">
                      <div class="name">
                        <span style="font-weight: bold;">{item.nombrePaciente}</span>
                        »
                        <span>Ced.: {item.cedula || ""}</span>
                      </div>
                      <div class="text-muted">{item.observaciones}</div>
                    </div>
                  </div>
                </div>
                {/each}

              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-7">
          <div class="card m-b-30">
            <div class="card-header">
              <h5 class="m-b-0">Paciente actual</h5>
            </div>
            <div class="card-body ">
              <form id="frmPaciente">
                <input type="hidden" name="IdUser" value="0" />
                <div class="row">
                  <div class="form-group col-md-6">
                    <label for="">Nombre</label>
                    <input
                      bind:value={paciente.nombre}
                      type="name"
                      class="form-control"
                      readonly
                      name="Name"
                      maxlength="200" />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="">Apellido</label>
                    <input
                      bind:value={paciente.apellidos}
                      type="name"
                      class="form-control"
                      readonly
                      name="Name"
                      maxlength="200" />
                  </div>

                  <div class="form-group col-md-6">
                    <label for="">Cedula</label>
                    <input
                      type="name"
                      class="form-control"
                      readonly
                      name="Name"
                      maxlength="200" />
                  </div>

                  <div class="form-group col-md-6">
                    <label for="">Telefono</label>
                    <input
                      bind:value={paciente.telefono}
                      type="tel"
                      class="form-control"
                      readonly
                      name="Name"
                      maxlength="200" />
                  </div>

                  <div class="form-group col-md-12">
                    <label for="">Correo electronico</label>
                    <input
                      type="email"
                      class="form-control"
                      readonly
                      name="Name"
                      maxlength="200" />
                  </div>

                  <div class="form-group col-md-6">
                    <label for="">Aseguradora</label>
                    <input
                      bind:value={paciente.nombreAseguradora}
                      type="email"
                      class="form-control"
                      readonly
                      name="Name"
                      maxlength="200" />
                  </div>

                  <div class="form-group col-md-6">
                    <label for="">No. Seguro</label>
                    <input
                      type="text"
                      class="form-control"
                      readonly
                      name="Name"
                      maxlength="200" />
                  </div>

                  <div class="form-group col-md-6">
                    <label for="">Pais</label>
                    <input
                      type="email"
                      class="form-control"
                      readonly
                      name="Name"
                      maxlength="200" />
                  </div>

                  <div class="form-group col-md-6">
                    <label for="">Provincia</label>
                    <input
                      type="email"
                      class="form-control"
                      readonly
                      name="Name"
                      maxlength="200" />
                  </div>

                  <div class="form-group col-md-12">
                    <label for="">Direccion</label>
                    <textarea
                      class="form-control"
                      rows="2"
                      readonly
                      name="Observaciones" />
                  </div>

                  <div class="form-group col-md-12">
                    <label for="">Observaciones</label>
                    <textarea
                      bind:value={paciente.observaciones}
                      class="form-control"
                      rows="3"
                      name="Observaciones" />
                  </div>
                  <br />

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</main>
