<script>
    import Aside from "../../Layout/Aside.svelte";
    import Header from "../../Layout/Header.svelte";
    import { activePage, session, axios } from "../../store.js";
    import { onDestroy, onMount } from "svelte";
    import { push, link } from "svelte-spa-router";
    import { Lightbox } from 'svelte-lightbox';
    export let params = {}
    
    let solicitudDetalle = []
    let paciente = []
    let imagenesRecetas = []

    function cargarDetalleSolicitud(){
        $axios.get(`/solicitudes/${params.id}`)
            .then(res => {
                solicitudDetalle = res.data
                paciente = res.data.paciente
            })
    }

    function cargarImagenSolicitud(){
        $axios.get(`/solicitudes/${params.id}/attachments`)
            .then(res => {
                imagenesRecetas = res.data
            })
    }

    cargarDetalleSolicitud()
    cargarImagenSolicitud()
    onMount(()=>{
    })
  </script>
  
  <Aside />
  
  <main class="admin-main">
    <Header />
    <section class="admin-content">
        <div class="container-fluid mt-3">
            <h4>Detalle Solicitud <span class="badge badge-primary">{solicitudDetalle.codigo}</span></h4>
            <div class="card m-b-30">
                <div class="card-header">
                    <h5 class="card-title m-b-0">Datos personales </h5>
                </div>
                <div class="card-body">
                    <div class="form-row">
                        <div class="form-group col-lg-4 col-md-6">
                            <label for="nombre">Nombre</label>
                            <input type="text" class="form-control" value={paciente.nombre} readonly id="nombre" placeholder="Email">
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                            <label for="apellido">Apellidos</label>
                            <input type="text" class="form-control" value={paciente.apellidos} readonly id="apellido">
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                            <label for="apodo">Apodo</label>
                            <input type="text" class="form-control" value={paciente.apodo} readonly id="apodo">
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                            <label for="cedula">Cedula</label>
                            <input type="text" class="form-control" value={paciente.cedula} readonly id="cedula">
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                            <label for="aseguradora">Aseguradora</label>
                            <input type="text" class="form-control" value={paciente.aseguradora} readonly id="aseguradora">
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                            <label for="afiliado">No. Afiliado / NSS</label>
                            <input type="text" class="form-control" value={paciente.noAfiliado} readonly id="afiliado">
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                            <label for="nacimiento">Fecha de nacimiento</label>
                            <input type="text" class="form-control" value={new Date(paciente.fechaNacimiento).toLocaleDateString('es-DO')} readonly id="nacimiento">
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                            <label for="sexo">Sexo</label>
                            <input type="text" class="form-control" value={paciente.sexo} readonly id="sexo">
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                            <label for="email">Correo electronico</label>
                            <input type="text" class="form-control" value={paciente.email} readonly id="email">
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                            <label for="provincia">Provincia</label>
                            <input type="text" class="form-control" value={paciente.provincia} readonly id="provincia">
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                            <label for="municipio">Municipio</label>
                            <input type="text" class="form-control" value={paciente.municipio} readonly id="municipio">
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                            <label for="ciudad">Ciudad</label>
                            <input type="text" class="form-control" value={paciente.ciudad} readonly id="ciudad">
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                            <label for="barrio">Barrio</label>
                            <input type="text" class="form-control" value={paciente.barrio} readonly id="barrio">
                        </div>
                        
                        <div class="form-group col-lg-8 col-md-6">
                            <label for="direccion">Direccion</label>
                            <input type="text" class="form-control" value={paciente.ciudad} readonly id="direccion">
                        </div>
                    </div>
                </div>
            </div>
            <div class="card m-b-30">
                <div class="card-header">
                    <h5 class="card-title m-b-0">Datos solicitud </h5>
                    <div class="card-controls">
                        <span class="badge badge-primary">Fecha: {new Date(solicitudDetalle.createdAt).toLocaleString()}</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="form-row">
                        <div class="form-group col-lg-4 col-md-6">
                            <label for="codigo">Codigo Solicitud</label>
                            <input type="text" class="form-control" value={solicitudDetalle.codigo} readonly id="codigo">
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                            <label for="catAfiliado">Categoria de afiliado</label>
                            <input type="text" class="form-control" value={solicitudDetalle.categoriaAfiliado} readonly id="catAfiliado">
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                            <label for="colectivo">Colectivo</label>
                            <input type="text" class="form-control" value={solicitudDetalle.colectivo} readonly id="colectivo">
                        </div>
                        <div class="form-group col-lg-12 col-md-12">
                            <div class="form-group">
                                <label for="exampleFormControlTextarea1">Sintomas</label>
                                <textarea class="form-control" style="width:100%" disabled rows="3">{solicitudDetalle.comentario}</textarea>
                              </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card m-b-30 mb-5">
                <div class="card-header">
                    <h5 class="card-title m-b-0">Archivos </h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <a href="https://odyssey-api.cmsiglo21.app/api/archivos/storage/{paciente.imagenCedula}" target="_blank" class="col-lg-4">
                            <img src="https://odyssey-api.cmsiglo21.app/api/archivos/storage/{paciente.imagenCedula}" class="img-galeria img-thumbnail" alt="cedula"/>
                        </a>
                        <a href="https://odyssey-api.cmsiglo21.app/api/archivos/storage/{paciente.imagenSeguro}" target="_blank" class="col-lg-4">
                            <img src="https://odyssey-api.cmsiglo21.app/api/archivos/storage/{paciente.imagenSeguro}" class="img-galeria img-thumbnail" alt="cedula"/>
                        </a>
                        {#each imagenesRecetas as img}
                            <a href="https://odyssey-api.cmsiglo21.app/api/archivos/storage/{img.name}" target="_blank" class="col-lg-4">
                                <img src="https://odyssey-api.cmsiglo21.app/api/archivos/storage/{img.name}" class="img-galeria img-thumbnail" alt="cedula"/>
                            </a>
                        {/each}
                    </div>
                </div>
            </div>
        </div><br>

    </section>
  </main>

  <style>
      .img-galeria{
          height: 200px;
          object-fit: cover;
          width: 100%;
      }
  </style>
  