<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
  import DiaSemana from "../../Components/DiaSemana.svelte";
  import { push } from "svelte-spa-router";
  import { activePage, dataCita, host } from "../../store";
  import { onMount } from "svelte";
  import axios from "axios";
  
  $activePage = "mantenimiento.peril";

  let fecha = "";
  let tandaID = 0;
  let horarios = [];
  let tandas = [];
  let horasDisponibles = [];

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
    let d = new Date();

    if ($dataCita.fechaCita == undefined) {
      fecha = d.toISOString().split('T')[0];
      tandaID = 1;
    } else {
      fecha = $dataCita.fechaCita;
      tandaID = $dataCita.tandaID
    }

    buscarDisponibilidadHorario();
    horariosDelMedico();
    cargarTandas();
  });

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
  function horariosDelMedico() {
    let id = '238902f7-8445-4640-9e69-892cbfc3019e';
    axios.get($host + "/Medicos/Horarios/" + id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
        horarios = res.data;

        diasSemana = diasSemana.map(e => {
          return {
            check: horarios.some(i => i.dia == e.dia),
            dia: e.dia,
            nombre: e.nombre
          }
        });
      }).catch(err => {
        console.error(err);
      });
  }
  function buscarDisponibilidadHorario() {
    if (fecha == "" || tandaID <= 0) {
      horasDisponibles = [];
      return;
    }

    let id = "238902f7-8445-4640-9e69-892cbfc3019e";
    let params = "date=" + fecha + "&" + "tandiId=" + tandaID;
    axios.get($host + "/Medicos/HorasDisponibles/" + id + "?" + params, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
    .then(res => {
      horasDisponibles = res.data;
    })
    .catch(err => {
      horasDisponibles = [];
      console.error(err); 
    })
  }

  function crearCita(hora) {
    $dataCita = {
      fechaCita: fecha,
      tandaID: tandaID,
      hora: hora,
      medicoId: "238902f7-8445-4640-9e69-892cbfc3019e"
    };
    push('/Cita/Crear/');
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
                <h3 class="p-t-10 searchBy-name">Dr. Joel Mena</h3>
              </div>
              <div class="text-muted text-center m-b-10">
                Ginecologo obstetra
              </div>
              <p class="text-muted text-center" style="margin-bottom: 0;">
                joelmena056@gmail.com
              </p>
              <p class="text-muted text-center">809-588-1717</p>
              <div class="row text-center p-b-10">
                <div class="col">
                  <a
                    href="#!"
                    on:click|preventDefault={() => {
                      document
                        .querySelector('#horarioEspecialista')
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
                  <a href="#/">
                    <h3 class="mdi mdi-account-edit"> </h3>
                    <div class="text-overline">Editar Perfil</div>
                  </a>

                </div>
                <div class="col">
                  <a href="#/Cita/Crear">
                    <h3 class="mdi mdi-calendar-plus"> </h3>
                    <div class="text-overline">Cita Nueva</div>
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
                  <button
                    type="button"
                    class="btn btn-primary shadow-none btn-sm">
                    <i class="mdi mdi-calendar" />
                    Hoy
                  </button>
                  <button
                    type="button"
                    class="btn btn-white shadow-none btn-sm">
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
                      bind:value={fecha} on:input={buscarDisponibilidadHorario}/>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group ">
                    <label class="font-secondary">Tanda</label>
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
                    <div class="name">{item}</div>
                  </div>
                  <div class="ml-auto">
                    <button
                      class="btn btn-outline-success btn-sm"
                      on:click={crearCita(item)}>
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

        <div class="col-lg-12" id="horarioEspecialista">
          <div class="card m-b-30">
            <div class="card-header">
              <h5 class="m-b-0">
                <i class="mdi mdi-calendar-multiselect" />
                Citas programadas
              </h5>
              <div class="card-controls">

                <div class="btn-group" role="group" aria-label="Basic example">
                  <input type="date" class="form-control form-control-sm" />
                  <button
                    type="button"
                    class="btn btn-primary shadow-none btn-sm">
                    Hoy
                  </button>
                  <button
                    type="button"
                    class="btn btn-white shadow-none btn-sm">
                    Mañana
                  </button>
                  <button
                    type="button"
                    class="btn btn-white shadow-none btn-sm">
                    Semana
                  </button>
                </div>

              </div>
            </div>
            <div class="card-body">
              <div class="alert alert-success" role="alert">
                No hay citas programadas para este dia
              </div>


              <div class="row">
                <div class="col-lg-6">
                  <div class="card m-b-20 card-vnc">
                    <div class="card-header">
                      <h5 class="m-b-0">Miercoles 22, Julio</h5>
                    </div>
                    <div class="card-body">
    
                      <div class="list-group list ">
                        <div class="list-group-item d-flex align-items-center">
                          <div class="">
                            <div class="name text-primary">
                              Alfredo Joel Mena Villafañas
                            </div>
                            <div class="text-muted">
                              <span>10:00</span>
                              -
                              <span>Mañana</span>
                              -
                              <span>Cita primera vez (Observaciones)</span>
                            </div>
                          </div>
                        </div>
                        <div class="list-group-item d-flex align-items-center">
                          <div class="">
                            <div class="name text-primary">
                              Alfredo Joel Mena Villafañas
                            </div>
                            <div class="text-muted">
                              <span>10:00</span>
                              -
                              <span>Mañana</span>
                              -
                              <span>Cita primera vez (Observaciones)</span>
                            </div>
                          </div>
                        </div>
                        <div class="list-group-item d-flex align-items-center">
                          <div class="">
                            <div class="name text-primary">
                              Alfredo Joel Mena Villafañas
                            </div>
                            <div class="text-muted">
                              <span>10:00</span>
                              -
                              <span>Mañana</span>
                              -
                              <span>Cita primera vez (Observaciones)</span>
                            </div>
                          </div>
                        </div>
                      </div>
    
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="card m-b-20 card-vnc">
                    <div class="card-header">
                      <h5 class="m-b-0">Jueves 23, Julio</h5>
                    </div>
                    <div class="card-body">
    
                      <div class="list-group list ">
                        <div class="list-group-item d-flex align-items-center">
                          <div class="">
                            <div class="name text-primary">
                              Alfredo Joel Mena Villafañas
                            </div>
                            <div class="text-muted">
                              <span>10:00</span>
                              -
                              <span>Mañana</span>
                              -
                              <span>Cita primera vez (Observaciones)</span>
                            </div>
                          </div>
                        </div>
                        <div class="list-group-item d-flex align-items-center">
                          <div class="">
                            <div class="name text-primary">
                              Alfredo Joel Mena Villafañas
                            </div>
                            <div class="text-muted">
                              <span>10:00</span>
                              -
                              <span>Mañana</span>
                              -
                              <span>Cita primera vez (Observaciones)</span>
                            </div>
                          </div>
                        </div>
                        <div class="list-group-item d-flex align-items-center">
                          <div class="">
                            <div class="name text-primary">
                              Alfredo Joel Mena Villafañas
                            </div>
                            <div class="text-muted">
                              <span>10:00</span>
                              -
                              <span>Mañana</span>
                              -
                              <span>Cita primera vez (Observaciones)</span>
                            </div>
                          </div>
                        </div>
                      </div>
    
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          <div class="card m-b-30">
            <div class="card-header">
              <h5 class="m-b-0">
                <i class="mdi mdi-calendar-text" />
                Horario del especialista
              </h5>
            </div>
            <div class="card-body">
              {#each diasSemana as item}
              <DiaSemana {item} {tandas} {horarios} />
              {/each}

            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</main>
