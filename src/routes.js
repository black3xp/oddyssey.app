import { session } from "./store";
import { wrap } from 'svelte-spa-router';

import Index from './Pages/Home/Index.svelte'
import Login from './Pages/Home/Login.svelte'
import AsistenteIndex from './Pages/Asistente/Index.svelte'
import CitaCrear from './Pages/Cita/Crear.svelte'
import Gestion from './Pages/Cita/Gestion.svelte'
import UsuarioIndex from './Pages/Usuario/Index.svelte'
import MedicoPerfil from './Pages/Medico/Perfil.svelte'
import MedicoEspacioTrabajo from "./Pages/Medico/EspacioTrabajo.svelte"
import Error404 from './Pages/Home/Error404.svelte'
import Unauthorized from './Pages/Home/Unauthorized.svelte'
import { UserManager } from './util.js';

let $session = null;
session.subscribe(x => $session = x);
// let user = new UserManager($session.authorizationHeader.Authorization);

const routes = {
    "/": wrap(Index, x => $session.isValid),
    "/Home/Index": wrap(Index, x => $session.isValid),
    "/Home/Login": Login,
    "/Usuario/Index": wrap(UsuarioIndex, x => $session.isValid),
    "/Asistente/Index": wrap(AsistenteIndex, x => $session.isValid),
    "/Cita/Gestionar": wrap(Gestion, x => $session.isValid),
    "/Cita/Crear": wrap(CitaCrear, x => $session.isValid),
    "/Medico/Perfil/:id": wrap(MedicoPerfil, x => $session.isValid),
    "/Medico/EspacioTrabajo": wrap(MedicoEspacioTrabajo, x => $session.isValid),
    "/Home/Unauthorized": wrap(Unauthorized, x => $session.isValid),
    "*": Error404
}

export default routes;