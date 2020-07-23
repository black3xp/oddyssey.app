<script>
  import { createEventDispatcher } from 'svelte';
  import { host } from "../store";
  import axios from "axios";

  export let i = {};
  export let horarios = {};
  export let dia = {};

  const dispatch = createEventDispatcher();

  $: checked = horarios.some(
    x => x.dia == dia && x.tandaID == i.id && !x.inactivo
  );
  function cambiarCheck(e) {
    let obj = horarios.find(x => x.dia);
    let hr = {
      MedicoID: obj.medicoID,
      Dia: dia ,
      TandaID: i.id,
      HoraInicio: "00:00",
      HoraFin: "00:30",
      Intervalo: 30
    }

    if (e.target.checked) {
      if (horarios.some(x => x.dia == dia && x.tandaID == i.id)) {
        let data = horarios.find(x => x.dia && x.tandaID == i.id);
        hr = {
          MedicoID: data.medicoID,
          Dia: dia ,
          TandaID: i.id,
          HoraInicio: data.horaInicio,
          HoraFin: data.horaFin,
          Intervalo: data.intervalo,
          Inactivo: false
        }

        axios.put($host + "/Horarios", hr, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }).then(res => {
          dispatch('cambioHorario')
        }).catch(err => {
          console.error(err);
        });
      } else {
        axios.post($host + "/Horarios", hr, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }).then(res => {
          dispatch('cambioHorario')
        }).catch(err => {
          console.error(err);
        });
      }
    } else {
      let data = horarios.find(x => x.dia && x.tandaID == i.id);
      hr = {
        MedicoID: data.medicoID,
        Dia: dia ,
        TandaID: i.id,
        HoraInicio: data.horaInicio,
        HoraFin: data.horaFin,
        Intervalo: data.intervalo,
        Inactivo: true
      }

      axios.put($host + "/Horarios", hr, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }).then(res => {
          dispatch('cambioHorario')
        }).catch(err => {
          console.error(err);
        });
    }
  }


</script>

<label class="cstm-switch ml-3 mr-3 mb-2">
  <input
    type="checkbox"
    name="option"
    value={i.id}
    on:change={cambiarCheck}
    {checked}
    class="cstm-switch-input" />
  <span class="cstm-switch-indicator bg-success " />
  <span class="cstm-switch-description">{i.nombre}</span>
</label>
