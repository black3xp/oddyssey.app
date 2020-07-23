<script>
  import { host } from "../store";
  import axios from "axios";

  export let horario = {};
  $: invisible = horario.inactivo;

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
      axios.put($host + "/Horarios", obj, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }).then(res => {
          console.log(res.data);
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
                on:change={cambiarHorario} />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
{/if}
