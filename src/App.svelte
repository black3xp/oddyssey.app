<script>
  import Home from "./Pages/Home/Index.svelte";
  import Router from "svelte-spa-router";
  import { push } from "svelte-spa-router";
  import { connection } from './store.js'
  import routes from "./routes";
  import { onMount } from "svelte";
  import { session } from "./store";

  onMount( () => {
    if ($session.isValid) {
      $connection.start().catch(e => console.error(e))
    }
  })
</script>

<Router on:conditionsFailed={() =>{
  push('/Home/Login')
}} {routes}/>
