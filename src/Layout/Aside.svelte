<script>
  import { link } from "svelte-spa-router";
  import { activePage } from "../store.js";
</script>

<aside class="admin-sidebar">
  <div class="admin-sidebar-brand">
    <!-- begin sidebar branding-->
    <img
      class="admin-brand-logo"
      src="assets/img/logo.svg"
      width="40"
      alt="atmos Logo" />
    <span class="admin-brand-content">
      <a href="/" use:link>Gestor de Citas</a>
    </span>
    <!-- end sidebar branding-->
    <div class="ml-auto">
      <!-- sidebar pin-->
      <a href="#!" class="admin-pin-sidebar btn-ghost btn btn-rounded-circle">
        <!--  -->
      </a>
      <!-- sidebar close for mobile device-->
      <a href="#!" class="admin-close-sidebar">
        <!--  -->
      </a>
    </div>
  </div>
  <div class="admin-sidebar-wrapper js-scrollbar">
    <!-- Menu List Begins-->
    <ul class="menu">
      <!--list item begins-->
      <li class="menu-item" class:active={$activePage.includes('home.index')}>
        <a href="/" use:link class="menu-link">
          <span class="menu-label">
            <span class="menu-name">Escritorio</span>
          </span>
          <span class="menu-icon">
            <i class="icon-placeholder mdi mdi-view-dashboard-outline" />
          </span>
        </a>
      </li>
      <!--list item ends-->
      <!--list item begins-->
      <li class="menu-item " class:active={$activePage.includes('asistente')}>
        <a href="/Asistente/Index" use:link class="menu-link">
          <span class="menu-label">
            <span class="menu-name">Asistente</span>
          </span>
          <span class="menu-icon">

            <i class="icon-placeholder mdi mdi-calendar-check" />
          </span>
        </a>
      </li>
      <!--list item ends-->
      <!--list item begins-->
      <li class="menu-item " class:active={$activePage.includes('gestor')}>
        <a href="/Cita/Gestionar" use:link class="menu-link">
          <span class="menu-label">
            <span class="menu-name">Gestor de Citas</span>
          </span>
          <span class="menu-icon">

            <i class="icon-placeholder mdi mdi-calendar-multiselect" />

          </span>
        </a>
      </li>
      <!--list item ends-->

      <!--list item begins-->
      <li class="menu-item " class:active={$activePage.includes('espacioMedico')}>
        <a href="/Medico/EspacioTrabajo" use:link class="menu-link">
          <span class="menu-label">
            <span class="menu-name">Espacio del medico</span>
          </span>
          <span class="menu-icon">

            <i class="icon-placeholder mdi mdi-doctor" />

          </span>
        </a>
      </li>
      <!--list item ends-->

      <!--list item begins-->
      <li
        class="menu-item "
        class:opened={$activePage.includes('mantenimiento')}>
        <a href="#!" class="open-dropdown menu-link">
          <span class="menu-label">
            <span class="menu-name">
              Mantenimiento
              <span class="menu-arrow" />
            </span>
            <span class="menu-info">Usuarios...</span>
          </span>
          <span class="menu-icon">
            <i class="icon-placeholder mdi mdi-settings-outline" />
          </span>
        </a>
        <!--submenu-->
        <ul class="sub-menu">
          <li
            class="menu-item"
            class:active={$activePage.includes('mantenimiento.usuarios.index')}>
            <a href="/Usuario/Index" use:link class=" menu-link">
              <span class="menu-label">
                <span class="menu-name">Usuarios</span>
              </span>
              <span class="menu-icon">
                <i class="icon-placeholder ">U</i>
              </span>
            </a>
          </li>
        </ul>
      </li>
    </ul>
    <!-- Menu List Ends-->
  </div>
</aside>
