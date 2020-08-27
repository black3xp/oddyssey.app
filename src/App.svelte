<script>
  import Home from "./Pages/Home/Index.svelte";
  import Router from "svelte-spa-router";
  import {replace} from "svelte-spa-router";
  import { connection } from './store.js'
  import routes from "./routes";
  import { onMount } from "svelte";

  onMount( () => {
    $connection.start().catch(e => console.error(e))
  })
</script>

<Router {routes}/>
