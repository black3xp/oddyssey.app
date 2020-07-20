<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
  import { activePage, host, dataCita } from "../../store";
  import axios from "axios";
  import { onMount } from "svelte";

  $activePage = "gestor"

  let busqueda = "";
  let filter = {
    Nombre: "",
    PerfilID: 0,
    FechaCita: "",
    TandaID: 0
  }
  let especialidades = [];
  let listado = [];
  let tandas = [];

  onMount(() => {
    $dataCita = {};

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
    axios.get($host + "/Medicos/Query?" + qs , {
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
  
  function filtrar() {
    cargarMedicos();
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
                <input type="text" class="form-control" bind:value={filter.Nombre} 
                  on:input={filtrar}/>
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
                    <input id="radio-new1" name="bigradios" type="radio" />
                    <label
                      for="radio-new1"
                      style="height: 40px; padding: 3px 10px;">
                      <span class="radio-content">
                        <span class="h6 d-block">Hoy</span>
                      </span>
                    </label>
                  </div>
                  <div class="option-box">
                    <input id="radio-new2" name="bigradios" type="radio" />
                    <label
                      for="radio-new2"
                      style="height: 40px; padding: 3px 10px;">
                      <span class="radio-content">
                        <span class="h6 d-block">Mañana</span>
                      </span>
                    </label>
                  </div>
                  <div class="option-box">
                    <input id="radio-new3" name="bigradios" type="radio" />
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
                    <td>
                      <a href="#/Medico/Perfil/{item.id}"
                        class="btn btn-outline-primary btn-sm">
                        <i class="mdi mdi-contacts" />
                        Perfil
                      </a>
                      <a href="#/Cita/Crear"
                        class="btn btn-outline-success btn-sm">
                        <i class="mdi mdi-calendar-plus" />
                        Crear cita
                      </a>
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
