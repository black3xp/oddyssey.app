<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
  import { activePage } from "../../store";
  $activePage = "citas.crear";
</script>

<style>
  .modal-slide-right .modal-body {
    height: 100% !important;
    top: 0;
    overflow: auto;
  }

  .list-group-item {
    border-top: none;
    border-left: none;
    border-right: none;
    background-color: transparent;
  }

  .link-pacientes {
    width: 100%;
    border-radius: 5px;
  }

  .link-pacientes:hover {
    background-color: rgb(241, 241, 241);
  }
  .borde-derecho {
    border-right: 1px solid rgb(236, 236, 236);
  }
</style>

<Aside />

<main class="admin-main">
  <Header />
  <section class="admin-content">
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 mb-5">
          <div class="card">
            <div class="card-header">
              <h5>
                <i class="mdi mdi-checkbox-intermediate" />
                Creando cita
              </h5>
              <div class="card-controls">

                <button
                  class="btn btn-outline-primary btn-sm"
                  data-toggle="modal"
                  data-target="#modalPacientes"
                  type="button">
                  <i class="mdi mdi-search-web" />
                  Explorar paciente
                </button>

              </div>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-5 borde-derecho">
                  <div class="form-group">
                    <label for="inpNombre">Nombre paciente</label>
                    <input type="text" class="form-control" id="inpNombre" />
                  </div>
                  <div class="form-group">
                    <label for="inpNombre">Apellido paciente</label>
                    <input type="text" class="form-control" id="inpNombre" />
                  </div>
                  <div class="form-group">
                    <label for="inpNombre">Telefono / Celular</label>
                    <input type="tel" class="form-control" id="inpNombre" />
                  </div>
                  <div class="form-group">
                    <label for="inpNombre">Correo electronico</label>
                    <input type="email" class="form-control" id="inpNombre" />
                  </div>
                  <div class="form-group ">
                    <label class="font-secondary">Direccion</label>
                    <textarea class="form-control" rows="3" />
                  </div>

                </div>
                <div class="col-lg-7">
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label for="inputAddress2">Fecha cita</label>
                        <input
                          type="date"
                          class="form-control mb-2"
                          id="inputAddress2" />
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group ">
                        <label class="font-secondary">Tanda</label>
                        <select class="form-control js-select2">
                          <option value="0" disabled selected>
                            - Seleccionar -
                          </option>
                          <option>Matutina</option>
                          <option>Vespertina</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group ">
                        <label class="font-secondary">Hora</label>
                        <select class="form-control js-select2">
                          <option value="0" disabled selected>
                            - Seleccionar -
                          </option>
                          <option>10:30</option>
                          <option>11:00</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group ">
                        <label class="font-secondary">Médico</label>
                        <select class="form-control js-select2">
                          <option value="0" disabled selected>
                            - Seleccionar -
                          </option>
                          <option>Dra. Lourdes Rivas</option>
                          <option>Dr. Ejemplo</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-lg-12">
                      <div class="form-group ">
                        <label class="font-secondary">Observaciones</label>
                        <textarea class="form-control" rows="5" />
                      </div>
                    </div>
                    <div class="col-lg-12 p-t-80" style="text-align: right;">
                      <button class="btn btn-success">
                        <i class="mdi mdi-content-save-outline" />
                        Crear cita
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<!-- Modal -->
<div
  class="modal fade modal-slide-right"
  id="modalPacientes"
  tabindex="-1"
  role="dialog"
  aria-labelledby="modalPacientes"
  style="display: none; padding-right: 16px;"
  aria-modal="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalPacientes">Buscar pacientes</h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div class="modal-body">

        <div class="input-group input-group-flush mb-3">
          <input
            type="search"
            class="form-control form-control-appended"
            placeholder="Buscar" />
          <div class="input-group-append">
            <div class=" input-group-text">
              <span class="mdi mdi-magnify" />
            </div>
          </div>
        </div>

        <div class="list-group list ">
          <div
            style="cursor:pointer;"
            class="list-group-item d-flex align-items-center link-pacientes">
            <div class="row">
              <div class="">
                <div class="name">
                  <span style="font-weight: bold;">Joel Mena</span>
                  »
                  <span>Tel.: 8095881717</span>
                  »
                  <span>ID: 40223257938</span>
                </div>
                <div class="text-muted">
                  C/F No. 8, Edificio Scarly, Apart. 9. Aguayo
                </div>
              </div>
            </div>
          </div>
          <div
            style="cursor:pointer;"
            class="list-group-item d-flex align-items-center link-pacientes">
            <div class="row">
              <div class="">
                <div class="name">
                  <span style="font-weight: bold;">Joel Alfredo Mena</span>
                  »
                  <span>Tel.: 80957455588</span>
                  »
                  <span>ID: 0568855446</span>
                </div>
                <div class="text-muted">
                  C/F No. 8, Edificio Scarly, Apart. 9. Aguayo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <div class="row text-center p-b-5">
          <div class="col">
            <a href="#!" class="btn btn-secondary" data-dismiss="modal">
              Cerrar
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
