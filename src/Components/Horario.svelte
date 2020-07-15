<script>
    export let horario = {};
</script>

<div class="row">
  <div class="col-lg-12 mt-3">
    <div class="alert alert-secondary" role="alert">
      <h4 class="alert-heading">{horario.tanda} {horario.dia}</h4>
      <hr />
      <div class="row">
        <div class="col-lg-3">
          <div class="form-group ">
            <label class="font-secondary">Hora de inicio</label>
            <input
              type="time"
              class="form-control"
              bind:value={horario.horaInicio} />
          </div>
        </div>
        <div class="col-lg-3">
          <div class="form-group ">
            <label class="font-secondary">Hora fin</label>
            <input type="time" class="form-control" bind:value={horario.horaFin} />
          </div>
        </div>
        <div class="col-lg-3">
          <div class="form-group">
            <label>Intervalo (Minutos)</label>
            <input
              type="text"
              class="form-control"
              bind:value={horario.intervalo} />
          </div>
        </div>

      </div>
    </div>
  </div>
</div>
