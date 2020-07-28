import Index from './Pages/Home/Index.svelte'
import Login from './Pages/Home/Login.svelte'
import AsistenteIndex from './Pages/Asistente/Index.svelte'
import CitaCrear from './Pages/Cita/Crear.svelte'
import Gestion from './Pages/Cita/Gestion.svelte'
import UsuarioIndex from './Pages/Usuario/Index.svelte'
import MedicoIndex from './Pages/Medico/Index.svelte'
import MedicoPerfil from './Pages/Medico/Perfil.svelte'
import MedicoWorkspace from "./Pages/Medico/Workspace.svelte"

//Error Page
import Error404 from './Pages/Home/Error404.svelte'

//External import

//Method

const routes = {
    "/": Index,
    "/Home/Login": Login,
    "/Usuario/Index": UsuarioIndex,
    "/Asistente/Index": AsistenteIndex,
    "/Cita/Gestionar": Gestion,
    "/Cita/Crear": CitaCrear,
    "/Medico/Index": MedicoIndex,
    "/Medico/Perfil/:id": MedicoPerfil,
    "/Medico/EspacioTrabajo": MedicoWorkspace,
    "*": Error404
}

export default routes;