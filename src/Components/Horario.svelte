<script>
  import { createEventDispatcher } from 'svelte';
  import { axios } from "../store.js";
  import moment from 'moment';

  export let horario = {};
  $: invisible = horario.inactivo;

  const dispatch = createEventDispatcher();

  function cambiarHorario(e) {
    let obj = {
      MedicoID: horario.medicoID,
      Dia: horario.dia,
      TandaID: horario.tandaID,
      HoraInicio: horario.horaInicio,
      HoraFin: horario.horaFin,
      Intervalo: horario.intervalo
    };

    if (!isNaN(horario.intervalo)) {
      let hora = moment(obj.HoraInicio, 'HH:mm');
      hora.add(obj.Intervalo, 'minutes');

      if (hora.format('HH:mm') > obj.HoraFin) {
        console.log('hora inicio mayor que hora fin')
      }
      
      $axios.put("/Horarios", obj)
      .then(res => {
        dispatch('cambioHorario')
      }).catch(err => {
        console.error(err);
      });
    }
  }
</script>

{#if !invisible}

  <div class="row">
    <div class="col-lg-12 mt-3">
      <div class="alert alert-secondary" role="alert">
        <h4 class="alert-heading">{horario.tanda}</h4>
        <hr />
        <div class="row">
          <div class="col-lg-3">
            <div class="form-group ">
              <label class="font-secondary">Hora de inicio</label>
              <input
                type="time"
                class="form-control"
                bind:value={horario.horaInicio}
                on:change={cambiarHorario} />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group ">
              <label class="font-secondary">Hora fin</label>
              <input
                type="time"
                class="form-control"
                bind:value={horario.horaFin}
                on:change={cambiarHorario} />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <label>Intervalo (Minutos)</label>
              <input
                type="number"
                class="form-control"
                bind:value={horario.intervalo}
                on:input={cambiarHorario} />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
{/if}
