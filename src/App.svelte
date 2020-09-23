<script>
  import Home from "./Pages/Home/Index.svelte";
  import Router from "svelte-spa-router";
  import { push } from "svelte-spa-router";
  import { connection, session } from "./store.js";
  import routes from "./routes";
  import { onMount } from "svelte";

  onMount(() => {
    if ($session.isValid) {
      $connection.start().catch(e => console.error(e));
    }
  });

  function event(e) {
    jQuery("body").removeClass('sidebar-open')
  }
</script>

<Router
  on:routeLoaded={event}
  on:conditionsFailed={() => {
    push('/Home/Login');
  }}
  {routes} />
