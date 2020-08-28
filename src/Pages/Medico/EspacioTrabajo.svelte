<script>
  import Aside from "../../Layout/Aside.svelte";
  import Header from "../../Layout/Header.svelte";
  import { connection, activePage } from '../../store.js'

  $activePage = "espacioMedico";
  let paciente = {};
  let cita = {};

  $connection.on("ReceiveMessage", (idPaciente, message) => {
    paciente = message.paciente;
    cita = message.cita;
  });
</script>

<style>
  .list-group-item{
    border-radius: 0 !important;
  }
  .list-group-item:last-child{
    border-bottom: none;
  }
  .list-group-item.activo{
    background-color: #687ae8;
    color: white ;
    border-radius: 3px !important;
  }
  .list-group-item.activo .text-muted{
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
          <button type="submit" class="btn btn-primary">
            <i class="mdi mdi-bell-ring-outline"></i> Llamar asistente</button>
          <button type="submit" class="btn btn-success">
            <i class="mdi mdi-check-all"></i> Pasar nuevo paciente</button>
        </div>
        <div class="col-lg-5">
          <div class="card m-b-20 card-vnc svelte-1e95eny">
            <div class="card-header">
              <h5 class="m-b-0">Lista de citas</h5>
            </div>
            <div class="card-body">
              <div class="list-group list ">
                <div class="list-group-item d-flex align-items-center link-pacientes svelte-1p1f2vm"
                  style="cursor: pointer;">
                  <div class="row">
                    <div class="">
                      <div class="name"><span style="font-weight: bold;">Joel Mena</span>
                        »
                        <span>Ced.: 40223257938</span></div>
                      <div class="text-muted">Cita de primera vez</div>
                    </div>
                  </div>
                </div>
                <div class="list-group-item activo d-flex align-items-center link-pacientes svelte-1p1f2vm"
                  style="cursor: pointer;">
                  <div class="row">
                    <div class="">
                      <div class="name"><span style="font-weight: bold;">Joel Mena</span>
                        »
                        <span>Ced.: 40223257938</span></div>
                      <div class="text-muted">Cita de primera vez</div>
                    </div>
                  </div>
                </div>
                <div class="list-group-item d-flex align-items-center link-pacientes svelte-1p1f2vm"
                  style="cursor: pointer;">
                  <div class="row">
                    <div class="">
                      <div class="name"><span style="font-weight: bold;">Joel Mena</span>
                        »
                        <span>Ced.: 40223257938</span></div>
                      <div class="text-muted">Cita de primera vez</div>
                    </div>
                  </div>
                </div>
  
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-7">
          <div class="card m-b-30">
            <div class="card-header">
                <h5 class="m-b-0">
                     Paciente actual
                </h5>
            </div>
            <div class="card-body ">
              <form id="frmPaciente"><input type="hidden" name="IdUser" value="0">
                <div class="row">
                  <div class="form-group col-md-6">
                    <label for="">Nombre</label> 
                    <input bind:value={paciente.nombre} type="name" class="form-control" readonly name="Name" maxlength="200">
                    </div>
                  <div class="form-group col-md-6">
                    <label for="">Apellido</label> 
                    <input bind:value={paciente.apellidos} type="name" class="form-control" readonly name="Name"maxlength="200">
                  </div>
              
              
                  <div class="form-group col-md-6">
                    <label for="">Cedula</label> 
                    <input type="name" class="form-control" readonly name="Name" maxlength="200">
                  </div>
              
              
                  <div class="form-group col-md-6">
                    <label for="">Telefono</label> 
                    <input bind:value={paciente.telefono} type="tel" class="form-control" readonly name="Name" maxlength="200">
                  </div>
              
              
                  <div class="form-group col-md-12">
                    <label for="">Correo electronico</label> 
                    <input type="email" class="form-control" readonly name="Name" maxlength="200">
                  </div>
              
              
                  <div class="form-group col-md-6">
                    <label for="">Aseguradora</label> 
                    <input bind:value={paciente.nombreAseguradora} type="email" class="form-control" readonly name="Name" maxlength="200">
                  </div>
              
              
                  <div class="form-group col-md-6">
                    <label for="">No. Seguro</label> 
                    <input type="text" class="form-control" readonly name="Name" maxlength="200">
                  </div>
              
              
                  <div class="form-group col-md-6">
                    <label for="">Pais</label> 
                    <input type="email" class="form-control" readonly name="Name" maxlength="200">
                  </div>
              
              
                  <div class="form-group col-md-6">
                    <label for="">Provincia</label> 
                    <input type="email" class="form-control" readonly name="Name" maxlength="200">
                  </div>
              
              
                  <div class="form-group col-md-12">
                    <label for="">Direccion</label> 
                    <textarea class="form-control" rows="2" readonly name="Observaciones"></textarea>
                  </div>
              
                  <div class="form-group col-md-12">
                    <label for="">Observaciones</label> 
                    <textarea bind:value={paciente.observaciones} class="form-control" rows="3" name="Observaciones"></textarea>
                  </div>
                  <br>
                  
                </div>
              </form>
            </div>
        </div>
        </div>
      </div>
      
    </div>
  </section>
</main>