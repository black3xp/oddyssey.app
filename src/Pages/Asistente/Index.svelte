<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
  import axios from "axios";
  import { activePage, host, dataCita, connection} from "../../store";
  import { onMount } from "svelte";
  import moment from 'moment';

  $activePage = "asistente.index";

  let busqueda = "";
  let medicos = [];
  let citasPendientes = [];
  let citasEnTurno = [];

  let horasDisponibles = [];
  let provincias = [
    {id: 1, nombre: 'Duarte'},
    {id: 2, nombre: 'Santiago'},
    {id: 3, nombre: 'Distrito Nacional'}
  ];
  let aseguradoras = [
    {id: 1, nombre: 'SENASA'},
    {id: 2, nombre: 'HUMANO SEGURO'},
    {id: 3, nombre: 'RENACER'},
    {id: 4, nombre: 'PALIC'},
    {id: 5, nombre: 'FUTURO'}
  ];
  let idMedico = '';
  let fecha = '';
  let tandaID = 0;

  let paciente = {
    id: "",
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    aseguradoraID: 0,
    nombreAseguradora: "",
    provinciaID: 0,
    noAfiliado: "",
    sexo: "",
    direccion: "",
    observaciones: "",
  }
  let cita = {
    id: 0,
    medicoID: "",
    pacienteID: "",
    aseguradoraID: 0,
    estadoID: 1,
    fecha: "",
    observaciones: ""
  }

  onMount(() => {
    jQuery("#sltMedicos").select2();
    jQuery("#sltMedicos").on("select2:select", e => {
      let data = e.params.data;
      idMedico = data.id;
      cargarCitas();
    });

    cargarMedicos();
  });

  function cargarProvincias() {
    axios.get($host + "/User/Query", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      medicos = res.data.filter(x => x.isDoctor);
    }).catch(err => {
      console.error(err); 
    })
  }
  function cargarMedicos() {
    axios.get($host + "/User/Query", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      medicos = res.data.filter(x => x.isDoctor);
    }).catch(err => {
      console.error(err); 
    })
  }
  function cargarCitas() {
    axios.get($host + "/Medicos/Citas/" + idMedico, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      let array = res.data.filter(e => 
        moment(e.fecha).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')
      );

      citasPendientes = array.filter(e => e.estadoID == 1)
      citasEnTurno = array.filter(e => e.estadoID == 2)
    }).catch(err => {
      console.error(err);
    });
  }
  function buscarDisponibilidadHorario() {
    if (fecha == "" || tandaID <= 0) {
      horasDisponibles = [];
      return;
    }

    let params = "date=" + fecha + "&" + "tandiId=" + tandaID;
    axios.get($host + "/Medicos/HorasDisponibles/" + idMedico + "?" + params, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      horasDisponibles = res.data.map(x => {
        return {
          time: x,
          hora: moment(x, 'LT').format('LT')
        }
      });
    }).catch(err => {
      horasDisponibles = [];
      console.error(err); 
    })
  }
  function cargarDatosPaciente(id) {
    axios.get($host + "/Pacientes?id=" + id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      paciente = res.data;
    }).catch(err => {
      console.error(err);
    });
  }
  function reprogramarCita(item) {
    cita = item;
    if (fecha == '' || tandaID <= 0) {
      fecha = moment().format('YYYY-MM-DD');
      tandaID = 1;
    }
    
    buscarDisponibilidadHorario();
  }
  function guardarPaciente() {
    paciente.nombreAseguradora = aseguradoras.find(e => e.id == paciente.aseguradoraID).nombre;
    
    axios.put($host + "/Pacientes/" + paciente.id, paciente, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.success) {
          alert('Paciente actualizado con exito');
          jQuery('#modalPaciente').modal('hide');
        } else {
          console.log(res);
        }
      }).catch(err => {
        console.error(err); 
      })
  }
  function cambiarFechaCita(hora) {
    cita.fecha = fecha + "T" + hora;

    axios.put($host + "/Citas/" + cita.id, cita, {
      headers: {Authorization: "Bearer " + localStorage.getItem("token")}
    }).then(res => {
      if (res.data.success) {
        alert('Fecha de cita actualizada con exito')
        jQuery('#modalCrearCita').modal('hide');
      } else {
        console.log(res);
      }
    }).catch(err => {
      console.error(err); 
    })
  }
  function cambiarEstadoCita(item) {
    cita = item;
    
    cita.estadoID = 2;
    axios.put($host + "/Citas/" + cita.id, cita, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.success) {
          cargarCitas()
        }
      }).catch(err => {
        console.error(err);
      })
  }

  function enviarPaciente(id) {
    console.log('Invoke')
    $connection.invoke("SendMessage", id, 'My message')
    .catch(err => console.error(err));
  }
</script>

<style>
  .cursor-table {
    cursor: pointer;
  }

  .cursor-table td {
    padding: 20px;
  }

  .circulo-rojo {
    background-color: #f2545b;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    display: block;
    float: right;
  }

  .circulo-verde {
    background-color: #0c9;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    display: block;
    float: right;
  }
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
      <div class="mt-4 col-md-12">
        <div class="row">
          <div class="col-md-5">
            <div class="input-group input-group-flush mb-3">
              <input
                type="search"
                class="form-control form-control-appended"
                data-bind="textInput: busqueda"
                placeholder="Buscar"
                bind:value={busqueda} />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="mdi mdi-magnify" />
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <select class="form-control" id="sltMedicos" style="width: 100%">
              <option value={0} disabled selected>- Seleccionar -</option>
              {#each medicos as item}
              <option value={item.id}>{item.name}</option>
              {/each}
            </select>
          </div>

          <a href="#/Cita/Crear" class="btn m-b-30 ml-2 mr-2 ml-3 btn-primary">
            <i class="mdi mdi-plus" />
            Nueva cita
          </a>
        </div>
      </div>
      <div class="col-md-12 m-b-30">

        <div class="alert alert-success" role="alert">
          <h4 class="alert-heading">Consultas en turno</h4>
          <div class="table-responsive">
            <h4 class:d-none={citasEnTurno.length > 0}>No hay cita</h4>
            {#if citasEnTurno.length > 0}
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
                {#each citasEnTurno as i}
                  <tr class="cursor-table">
                    <td>{i.nombrePaciente}</td>
                    <td></td>
                    <td>{i.observaciones}</td>
                    <td style="text-align: right;">
                      <button
                        class="btn btn-success btn-sm mb-1"
                        data-toggle="modal"
                        data-target="#modalPaciente"
                        on:click={cargarDatosPaciente(i.pacienteID)}>
                        <i class="mdi mdi-account-search-outline" />
                        Ver paciente
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
            {/if}
          </div>
      </div>

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
                  <td></td>
                  <td>{i.observaciones}</td>
                  <td></td>
                  <td style="text-align: right;">
                    <button
                      class="btn btn-success btn-sm mb-1"
                      data-toggle="modal"
                      data-target="#modalPaciente"
                      on:click={cargarDatosPaciente(i.pacienteID)} >
                      <i class="mdi mdi-account-search-outline" />
                      Ver paciente
                    </button>
                    <button
                      class="btn btn-success btn-sm mb-1"
                      data-toggle="modal" data-target="#modalCrearCita"
                      on:click={reprogramarCita(i)} >
                      <i class="mdi mdi-calendar-remove"></i>
                      Reprogramar
                    </button>
                    <button class="btn btn-primary btn-sm mb-1" title="Poner en cola"
                      on:click={() => cambiarEstadoCita(i)}>
                      <i class="mdi mdi-ticket-confirmation"></i>
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
          {/if}

        </div>
    </div>


        <div class="alert alert-secondary" role="alert">
          <h4 class="alert-heading">Consultas realizadas</h4>
          <div class="table-responsive">
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
  
                <tr class="cursor-table">
                  <td>Paciente</td>
                  <td>8095881717</td>
                  <td>Observaciones</td>
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
                      data-toggle="modal" data-target="#modalCrearCita">
                      <i class="mdi mdi-calendar-plus" />
                      Crear cita
                    </button>
                  </td>
                </tr>
  
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

        <form id="frmPaciente" on:submit|preventDefault={guardarPaciente}>
          <input type="hidden" name="IdUser" value="0" />
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Nombre</label>
              <input
                type="name"
                class="form-control"
                name="Name"
                maxlength="200"
                required bind:value={paciente.nombre}/>
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
                required bind:value={paciente.apellidos} />
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
                required bind:value={paciente.telefono} />
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
                required="" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Aseguradora</label>
              <select class="form-control js-select2" bind:value={paciente.aseguradoraID}>
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
              <select class="form-control js-select2">
                <option value="0" disabled selected>- Seleccionar -</option>
                <option>Rep. Dom.</option>
                <option>Haiti</option>
                <option>Venezuela</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Provincia</label>
              <select class="form-control js-select2" bind:value={paciente.provinciaID}>
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
              <textarea class="form-control" rows="2" bind:value={paciente.direccion}/>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Observaciones</label>
              <textarea class="form-control" rows="3" bind:value={paciente.observaciones}/>
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
            <button type="button" class="btn btn-success" title="Guardar y enviar"
              on:click={() => { enviarPaciente(paciente.id) }}>
              Enviar paciente
              <i class="mdi mdi-send" />
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</div>

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
              <input type="date" class="form-control form-control-sm"
                bind:value={fecha} on:change={buscarDisponibilidadHorario}>
            </div>
          </div> 
          <div class="col-lg-6">
            <div class="form-group ">
              <label class="font-secondary">Tanda</label> 
              <select class="form-control form-control-sm js-select2"
                bind:value={tandaID} on:change={buscarDisponibilidadHorario}>
                <option value={0} disabled>- Seleccionar -</option>
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
              <div class="name">{i.hora}</div>
            </div>
            <div class="ml-auto">
              <button on:click={cambiarFechaCita(i.time)} class="btn btn-outline-success btn-sm">
                Seleccionar</button>
            </div>
          </div>
          {/each}
        </div>

      </div>
    </div>
  </div>
</div>