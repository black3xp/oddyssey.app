<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
  import { activePage } from "../../store";
  import axios from "axios";
  import { onMount } from "svelte";

  $activePage = "gestor"

  let busqueda = "";
  let especialidades = [];

  let listado = [];
  $: listadoFiltrado = () => {
    return listado.filter(
      x =>
        x.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        x.apellidos.toLowerCase().includes(busqueda.toLowerCase())
    );
  };

  onMount(() => {
    axios
      .get("http://localhost:5000/_data/medicos.json")
      .then(res => {
        listado = res.data;
      })
      .catch(err => {
        console.error(err);
      });

    axios
      .get("http://localhost:5000/_data/especialidades.json")
      .then(res => {
        let data = res.data.map(x => {
          return {
            id: x.id,
            text: x.nombre
          };
        });
        jQuery("#sltEspecialidad").select2({
          data
        });
      })
      .catch(err => {
        console.error(err);
      });
  });
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
                <input bind:value={busqueda} type="text" class="form-control" />
              </div>
              <div class="form-group ">
                <label class="font-secondary">Especialidad</label>
                <select class="form-control select2" style="width: 100%;" id="sltEspecialidad">
                  <option value="">- Seleccionar -</option>
                </select>
              </div>
              <div class="form-group">
                <label for="inputAddress2">Fecha</label>
                <input
                  type="date"
                  class="form-control mb-2"
                  id="inputAddress2" />

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
                <select class="form-control js-select2">
                  <option value="0" disabled selected>- Seleccionar -</option>
                  <option>Matutina</option>
                  <option>Vespertina</option>
                </select>
              </div>
              <div class="form-group ">
                <label class="font-secondary">Hora</label>
                <select class="form-control js-select2">
                  <option value="0" disabled selected>- Seleccionar -</option>
                  <option>10:30</option>
                  <option>11:00</option>
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
                {#each listadoFiltrado() as item}
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
                    <td>{item.nombre + ' ' + item.apellidos}</td>
                    <td>{item.especialidad}</td>
                    <td>{item.telefono}</td>
                    <td>
                      <a
                        href="#/Medico/Perfil"
                        class="btn btn-outline-primary btn-sm">
                        <i class="mdi mdi-contacts" />
                        Perfil
                      </a>
                      <a
                        href="#/Cita/Crear"
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
