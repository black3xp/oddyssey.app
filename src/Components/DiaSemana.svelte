<script>
  import Horario from "./Horario.svelte";
  export let item = {};
  export let tandas = {};
  export let horarios = {};
  $: horariosFiltrados = horarios.filter(x => x.dia == item.dia);
  let checkTandas = [
    horarios.some(x => x.tandaID == 1),
    horarios.some(x => x.tandaID == 2)
  ];
</script>

<style>
  .card.card-vnc {
    box-shadow: none;
    border: #687ae8 solid 1px;
  }
</style>

<div class="card m-b-30 card-vnc">
  <div class="card-header">
    <h5 class="m-b-0">
      <div
        class="custom-control custom-checkbox"
        style="margin-left: 15px; padding-left: 0;">
        <input
          type="checkbox"
          class="custom-control-input"
          id={item.dia}
          bind:checked={item.check} />
        <label class="custom-control-label" for={item.dia}>{item.nombre}</label>
      </div>
    </h5>
  </div>
  <div class="card-body">
    <div class="row">
      {#each tandas as tanda}
        <label class="cstm-switch ml-3 mr-3 mb-2">
          <input
            type="checkbox"
            name="option"
            value={tanda.id}
            bind:checked={checkTandas[tanda.id]}
            class="cstm-switch-input" />
          <span class="cstm-switch-indicator bg-success " />
          <span class="cstm-switch-description">{tanda.nombre}</span>
        </label>
      {/each}
    </div>

    {#each horariosFiltrados as horario}
      <!-- {#if checkTandas[horario.tandaID-1] && item.check} -->
      <Horario {horario} />
      <!-- {/if} -->
    {/each}

  </div>
</div>
