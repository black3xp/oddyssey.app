<script>
  import Home from "./Pages/Home/Index.svelte";
  import Router from "svelte-spa-router";
  import routes from "./routes";
</script>

<Router {routes} />
