<script>
    import Aside from "../../Layout/Aside.svelte";
    import Header from "../../Layout/Header.svelte";
    import { activePage, session, axios } from "../../store.js";
    import { onDestroy, onMount } from "svelte";
    import { push, link } from "svelte-spa-router";

    let solicitudes = []


    function cargarSolicitudes(){
        $axios.get('/solicitudes')
            .then(res => {
                solicitudes = res.data
                console.log(solicitudes)
            })
    }

    onMount(()=>{
        cargarSolicitudes()
    })
  </script>
  
  <Aside />
  
  <main class="admin-main">
    <Header />
    <section class="admin-content">
        <div class="container-fluid mt-3">
            <h4>Solicitudes</h4>
            <div class="card m-b-30">
                <div class="card-header">
                    <!-- <h5 class="card-title m-b-0">Solicitudes </h5> -->

                    <div class="card-controls">

                        <a href="#" class="js-card-fullscreen icon"></a>
                        <a style="cursor:pointer;" on:click={cargarSolicitudes} class="js-card-refresh icon"></a>
                        <div class="dropdown">
                            <a href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="icon mdi  mdi-dots-vertical"></i> </a>

                            <div class="dropdown-menu dropdown-menu-right">
                                <button class="dropdown-item" type="button">Action</button>
                                <button class="dropdown-item" type="button">Another action</button>
                                <button class="dropdown-item" type="button">Something else here</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive mt-3">

                        <table class="table table-hover">
                            <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>No. Solicitud</th>
                                <th>Cedula</th>
                                <th>No. Seguro</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                                {#each solicitudes as solicitud}
                                     <tr>
                                         <td>{solicitud.nombre} {solicitud.apellidos}</td>
                                         <td>{solicitud.codigo}</td>
                                         <td>{solicitud.cedula || 'N/A'}</td>
                                         <td>{solicitud.numeroAsegurado || 'N/A'}</td>
                                         <td>{new Date(solicitud.createdAt).toLocaleString('es-DO')}</td>
                                         <td><span class="badge" class:badge-primary={solicitud.estadoId == 'N'}>{solicitud.estadoId}</span></td>
                                         <td><a href="/Solicitud/Detalle/{solicitud.id}" use:link class="btn btn-success btn-sm">VER <i class="mdi mdi-send"></i></a></td>
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
  