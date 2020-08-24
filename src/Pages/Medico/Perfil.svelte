<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
  import DiaSemana from "../../Components/DiaSemana.svelte";
  import { push } from "svelte-spa-router";
  import { activePage, dataCita, host } from "../../store";
  import { onMount } from "svelte";
  import axios from "axios";
  import moment from 'moment';
  
  $activePage = "mantenimiento.peril";
  export let params = {};
  let id = params.id;
  let data = $dataCita;

  let obj = {
    medicoID: "",
    name: "",
    email: "",
    perfil: "",
    prefix: "",
    phoneNumber: ""
  };
  let fecha = "";
  let fechaBusquedaCita = "";
  let tandaID = 0;
  let horarios = [];
  let tandas = [];
  let horasDisponibles = [];
  let citas = [];
  let citasDB = [];
  let btnFechaDisponibilidad = 'h';
  let btnFechaCita = '';

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
    btnFechaCita = 's';

    if ($dataCita.fechaCita == "" || $dataCita.fechaCita == undefined) {
      fecha = d.toISOString().split('T')[0];
      tandaID = 1;
    } else {
      fecha = $dataCita.fechaCita;
      tandaID = $dataCita.tandaID
    }

    cargarPerfil();
    buscarDisponibilidadHorario();
    cargarHorarios();
    cargarTandas();
    cargarCitas();
  });

  function cargarPerfil() {
    axios.get($host + "/Medicos/" + id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
        obj = res.data;
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
  function cargarHorarios() {
    axios.get($host + "/Medicos/Horarios/" + id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
        horarios = res.data;

        diasSemana = diasSemana.map(e => {
          return {
            check: horarios.some(i => i.dia == e.dia && !i.inactivo),
            dia: e.dia,
            nombre: e.nombre
          }
        });
      }).catch(err => {
        console.error(err);
      });
  }
  function cargarCitas() {
    axios.get($host + "/Medicos/Citas/" + id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
        let datos = res.data.map(x => {
          return {
            fecha: moment(x.fecha).format('LL'),
            hora: moment(x.fecha).format('LT'),
            observaciones: x.observaciones,
            nombrePaciente: x.nombrePaciente
          }
        });
        let diasUnicos = [...new Set( datos.map(e => { return e.fecha }) )];
        diasUnicos.sort()

        citasDB = diasUnicos.map(e => {
          let horas = datos.filter(i => i.fecha == e).map(e => {
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
        citas = citasDB;
        buscarCitas('s');
      }).catch(err => {
        console.error(err);
      });
  }

  function buscarDisponibilidadHorario() {
    let hoy = moment();
    let unDia = moment().add(moment.duration(1, 'd'));
    
    if (fecha == "" || tandaID <= 0) {
      horasDisponibles = [];
      return;
    }

    if (fecha == hoy.format('YYYY-MM-DD')) {
      btnFechaDisponibilidad = 'h';
    } else if (fecha == unDia.format('YYYY-MM-DD')) {
      btnFechaDisponibilidad = 'm';
    } else {
      btnFechaDisponibilidad = ''
    }

    let params = "date=" + fecha + "&" + "tandiId=" + tandaID;
    axios.get($host + "/Medicos/HorasDisponibles/" + id + "?" + params, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      horasDisponibles = res.data.map(e => {
        return {
          time : e,
          hora : moment(e, 'LT').format('LT')
        } 
      });
    }).catch(err => {
      horasDisponibles = [];
      console.error(err); 
    })
  }

  function crearCita(hora) {
    $dataCita = {
      fechaCita: fecha,
      tandaID: tandaID,
      hora: hora,
      medicoId: id
    };
    push('/Cita/Crear/');
  }

  function diaSiguiente(params) {
    let d = new Date();
    let sumaDia = d.setDate(d.getDate() + 1);
    let newDate = new Date(sumaDia);
    fecha = newDate.toISOString().split('T')[0];

    btnFechaDisponibilidad = 'm';

    buscarDisponibilidadHorario();
  }
  function diaDeHoy(params) {
    let d = new Date();
    fecha = d.toISOString().split('T')[0];
    btnFechaDisponibilidad = 'h';

    buscarDisponibilidadHorario();
  }
  function buscarCitas(tipo) {
    let hoy = moment();
    btnFechaCita = tipo;

    if (tipo == 'h') {
      fechaBusquedaCita = hoy.format('YYYY-MM-DD');
      citas = citasDB.filter(e => e.fecha == hoy.format('LL'));
    } else if (tipo == 'm') {
      hoy.add(moment.duration(1, 'd'));
      fechaBusquedaCita = hoy.format('YYYY-MM-DD')
      citas = citasDB.filter(e => e.fecha == hoy.format('LL'));
    } else if (tipo == 's') {
      fechaBusquedaCita = ''
      citas = citasDB.filter(e => moment(e.fecha).format('W') == hoy.format('W'));
    } else {
      if (fechaBusquedaCita == hoy.format('YYYY-MM-DD')) {
        btnFechaCita = 'h';
      } else if (fechaBusquedaCita == hoy.add(moment.duration(1, 'd')).format('YYYY-MM-DD')) {
        btnFechaCita = 'm';
      } else if (moment(fechaBusquedaCita).format('W') == hoy.format('W')) {
        btnFechaCita = 's'
      } else {
        btnFechaCita = ''
      }

      citas = citasDB.filter(e => e.fecha == moment(fechaBusquedaCita).format('LL'));
    }
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
                <h3 class="p-t-10 searchBy-name">{obj.prefix} {obj.name}</h3>
              </div>
              <div class="text-muted text-center m-b-10">
                {obj.perfil || ""}
              </div>
              <p class="text-muted text-center" style="margin-bottom: 0;">
                {obj.email}
              </p>
              <p class="text-muted text-center">{obj.phoneNumber}</p>
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

        <div class="col-lg-12" id="horarioEspecialista">
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
                    class:btn-primary={btnFechaCita == 'h'} class:btn-write={btnFechaCita != 'h'}
                    class="btn shadow-none btn-sm"
                    on:click={() => buscarCitas('h')}>
                    Hoy
                  </button>
                  <button
                    type="button"
                    class:btn-primary={btnFechaCita == 'm'} class:btn-write={btnFechaCita != 'm'}
                    class="btn shadow-none btn-sm"
                    on:click={() => buscarCitas('m')}>
                    Mañana
                  </button>
                  <button
                    type="button"
                    class:btn-primary={btnFechaCita == 's'} class:btn-write={btnFechaCita != 's'}
                    class="btn shadow-none btn-sm"
                    on:click={() => buscarCitas('s')}>
                    Semana
                  </button>
                </div>

              </div>
            </div>
            <div class="card-body">
              {#if citas.length == 0}
              <div class="alert alert-success" role="alert">
                No hay citas programadas para este dia
              </div>
              {/if}

              <div class="row">
                {#each citas as i}
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
                              <span>Mañana</span>
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
          
          <div class="card m-b-30">
            <div class="card-header">
              <h5 class="m-b-0">
                <i class="mdi mdi-calendar-text" />
                Horario del especialista
              </h5>
            </div>
            <div class="card-body">
              {#each diasSemana as item}
              <DiaSemana on:cambioHorario={cargarHorarios} on:cambioHorario={buscarDisponibilidadHorario}
                {item} {tandas} {horarios} medicoID={id} />
              {/each}

            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</main>
