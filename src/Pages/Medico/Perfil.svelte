<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";

  let diasSemana = [
    {check: false, value: 1, nombre: 'Lunes', tandas: [
      {check: false, value: 11, nombre: 'Mañana'},
      {check: false, value: 12, nombre: 'Tarde'},
      {check: false, value: 13, nombre: 'Noche'}
    ]},
    {check: false, value: 2, nombre: 'Martes', tandas: [
      {check: false, value: 21, nombre: 'Mañana'},
      {check: false, value: 22, nombre: 'Tarde'},
      {check: false, value: 23, nombre: 'Noche'}
    ]},
    {check: false, value: 3, nombre: 'Miercoles', tandas: [
      {check: false, value: 31, nombre: 'Mañana'},
      {check: false, value: 32, nombre: 'Tarde'},
      {check: false, value: 33, nombre: 'Noche'}
    ]},
    {check: false, value: 4, nombre: 'Jueves', tandas: [
      {check: false, value: 41, nombre: 'Mañana'},
      {check: false, value: 42, nombre: 'Tarde'},
      {check: false, value: 43, nombre: 'Noche'}
    ]},
    {check: false, value: 5, nombre: 'Viernes', tandas: [
      {check: false, value: 51, nombre: 'Mañana'},
      {check: false, value: 52, nombre: 'Tarde'},
      {check: false, value: 53, nombre: 'Noche'}
    ]},
    {check: false, value: 6, nombre: 'Sabado', tandas: [
      {check: false, value: 61, nombre: 'Mañana'},
      {check: false, value: 62, nombre: 'Tarde'},
      {check: false, value: 63, nombre: 'Noche'}
    ]},
    {check: false, value: 7, nombre: 'Domingo', tandas: [
      {check: false, value: 71, nombre: 'Mañana'},
      {check: false, value: 72, nombre: 'Tarde'},
      {check: false, value: 73, nombre: 'Noche'}
    ]},
  ];

  $: {
    let save = diasSemana.filter(x => x.check);
    console.log(save);
  }
</script>

<style>
  .list-group-item:nth-child(2) {
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
                    <h3 class="mdi mdi-timetable" />
                    <div class="text-overline">Horario</div>

                  </a>
                </div>
                <div class="col">
                  <a href="#">
                    <h3 class="mdi mdi-account-edit" />
                    <div class="text-overline">Editar Perfil</div>

                  </a>

                </div>
                <div class="col">
                  <a href="#/Cita/Crear">
                    <h3 class="mdi mdi-calendar-plus" />
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
                    <input type="date" class="form-control form-control-sm" />
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group ">
                    <label class="font-secondary">Tanda</label>
                    <select class="form-control form-control-sm js-select2">
                      <option value="0" disabled selected>
                        - Seleccionar -
                      </option>
                      <option>Matutina</option>
                      <option>Vespertina</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="alert alert-success" role="alert">
                No hay disponibilidad con este horario
              </div>

              <div class="list-group list">
                <div class="list-group-item d-flex align-items-center">
                  <div class="">
                    <div class="name">10:00</div>
                    <div class="text-muted">Mañana</div>
                  </div>
                  <div class="ml-auto">
                    <a
                      class="btn btn-outline-success btn-sm"
                      href="#/Cita/Crear">
                      <i class="mdi mdi-calendar-plus" />
                      Crear cita
                    </a>
                  </div>

                </div>
                <div class="list-group-item d-flex align-items-center">
                  <div class="">
                    <div class="name">5:00</div>
                    <div class="text-muted">Tarde</div>
                  </div>
                  <div class="ml-auto">
                    <a
                      class="btn btn-outline-success btn-sm"
                      href="#/Cita/Crear">
                      <i class="mdi mdi-calendar-plus" />
                      Crear cita
                    </a>
                  </div>

                </div>
                <div class="list-group-item d-flex align-items-center">
                  <div class="">
                    <div class="name">11:00</div>
                    <div class="text-muted">Mañana</div>
                  </div>
                  <div class="ml-auto">
                    <a
                      class="btn btn-outline-success btn-sm"
                      href="#/Cita/Crear">
                      <i class="mdi mdi-calendar-plus" />
                      Crear cita
                    </a>
                  </div>

                </div>
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
              <div class="card m-b-30 card-vnc">
                <div class="card-header">
                  <h5 class="m-b-0">
                    <div
                      class="custom-control custom-checkbox"
                      style="margin-left: 15px; padding-left: 0;">
                      <input
                        type="checkbox"
                        class="custom-control-input"
                        id={item.nombre}
                        bind:checked={item.check} />
                      <label class="custom-control-label" for={item.nombre}>
                        {item.nombre}
                      </label>
                    </div>
                  </h5>
                </div>
                <div class="card-body">
                  {#if item.check}
                  <div class="row">
                    {#each item.tandas as tanda}
                    <label class="cstm-switch ml-3 mr-3 mb-2">
                      <input
                        type="checkbox"
                        name="option"
                        value={tanda.value}
                        bind:checked={tanda.check}
                        class="cstm-switch-input" />
                      <span class="cstm-switch-indicator bg-success " />
                      <span class="cstm-switch-description">{tanda.nombre}</span>
                    </label>
                    {/each}
                  </div>
                  {/if}

                  {#each item.tandas as tanda}
                    {#if tanda.check && item.check}
                    <div class="row">
                      <div class="col-lg-12 mt-3">
                        <div class="alert alert-secondary" role="alert">
                          <h4 class="alert-heading">{tanda.nombre}</h4>
                          <hr />
                          <div class="row">
                            <div class="col-lg-3">
                              <div class="form-group ">
                                <label class="font-secondary">
                                  Hora de inicio
                                </label>
                                <input type="time" class="form-control" />
                              </div>
                            </div>
                            <div class="col-lg-3">
                              <div class="form-group ">
                                <label class="font-secondary">Hora fin</label>
                                <input type="time" class="form-control" />
                              </div>
                            </div>
                            <div class="col-lg-3">
                              <div class="form-group">
                                <label>Intervalo (Minutos)</label>
                                <input type="text" class="form-control" />
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                    {/if}
                  {/each}

                </div>
              </div>
              {/each}

            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</main>
