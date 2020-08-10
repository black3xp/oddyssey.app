<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
  import axios from "axios";
  import { activePage, host } from "../../store";
  import { onMount } from "svelte";
  import moment from 'moment';

  $activePage = "asistente.index";

  let busqueda = "";
  let medicos = [];
  let citas = [];
  let idMedico = '';

  onMount(() => {
    jQuery("#sltMedicos").select2();
    jQuery("#sltMedicos").on("select2:select", e => {
      let data = e.params.data;
      idMedico = data.id;
      cargarCitas();
    });

    cargarMedicos();
  });

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
      console.log(res.data)
      citas = res.data.map(e => {
        return {
          nombrePaciente: e.nombrePaciente,
          observaciones: e.observaciones,
          fecha: moment(e.fecha).format('LL'),
          hora: moment(e.fecha).format('LT')
        }
      });
    }).catch(err => {
      console.error(err);
    });
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
            <select class="form-control" id="sltMedicos">
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
            <table class="table align-td-middle table-card">
              <tbody>
  
                <tr class="cursor-table">
                  <td>Paciente</td>
                  <td>Observaciones</td>
                  <td>40222355854</td>
                  <td>8095881717</td>
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
                      data-target="#modalPaciente">
                      <i class="mdi mdi-calendar-plus" />
                      Crear cita
                    </button>
                  </td>
                </tr>
  
              </tbody>
            </table>
  
          </div>
      </div>

      <div class="alert alert-primary" role="alert">
        <h4 class="alert-heading">Consultas pendientes</h4>
        <div class="table-responsive">
          <table class="table align-td-middle table-card">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Observacion</th>
                <th>Cedula</th>
                <th>Celular</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {#each citas as i}
              <tr class="cursor-table">
                <td>{i.nombrePaciente}</td>
                <td>{i.observaciones}</td>
                <td></td>
                <td></td>
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
                    data-target="#modalPaciente">
                    <i class="mdi mdi-calendar-plus" />
                    Crear cita
                  </button>
                  <button class="btn btn-primary btn-sm mb-1" title="Poner en cola">
                    <i class="mdi mdi-ticket-outline"></i>
                  </button>
                </td>
              </tr>
              {/each}
            </tbody>
          </table>

        </div>
    </div>


        <div class="alert alert-secondary" role="alert">
          <h4 class="alert-heading">Consultas realizadas</h4>
          <div class="table-responsive">
            <table class="table align-td-middle table-card">
              <tbody>
  
                <tr class="cursor-table">
                  <td>Paciente</td>
                  <td>Observaciones</td>
                  <td>40222355854</td>
                  <td>8095881717</td>
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
                      data-target="#modalPaciente">
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
                required="" />
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
                required="" />
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
                required="" />
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
                required="" />
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
              <select class="form-control js-select2">
                <option value="0" disabled selected>- Seleccionar -</option>
                <option>SENASA</option>
                <option>Primera ARS Humano</option>
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
                required="" />
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
              <select class="form-control js-select2">
                <option value="0" disabled selected>- Seleccionar -</option>
                <option>Duarte</option>
                <option>Santiago</option>
                <option>Santo Domingo</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Direccion</label>
              <textarea class="form-control" rows="2" name="Observaciones" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="">Observaciones</label>
              <textarea class="form-control" rows="3" name="Observaciones" />
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
            <button type="submit" class="btn btn-success" title="Guardar y enviar">
              Enviar paciente
              <i class="mdi mdi-send" />
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</div>
