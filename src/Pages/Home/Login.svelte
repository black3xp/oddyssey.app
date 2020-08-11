<script>
  import { host } from "../../store";
  import { push } from "svelte-spa-router";
  import axios from "axios";

  let obj = {
    username: "",
    password: ""
  };

  function iniciar() {
    var qs = Object.keys(obj)
      .map(key => key + "=" + obj[key])
      .join("&");
    axios.get($host + "/User/Login?" + qs)
      .then(x => {
        if (x.status >= 200 && x.status < 300) {
            localStorage.setItem('token', x.data.data);
            push('/Home/Index');
        }
      }).catch(e => {
        console.log(e);
      });
  }
</script>

<style>

</style>

<main>
  <div class="container-fluid">
    <div class="row ">
      <div class="col-lg-4 bg-white">
        <div class="row align-items-center m-h-100">
          <div class="mx-auto col-md-8">
            <div class="p-b-20 text-center" />
            <h3 class="text-center p-b-20 fw-400">Entrar</h3>
            <form
              class="needs-validation"
              action=""
              on:submit|preventDefault={iniciar}>
              <div class="form-row">
                <div class="form-group floating-label col-md-12">
                  <label>Correo electronico</label>
                  <input
                    type="username"
                    required
                    class="form-control"
                    placeholder="Correo electronico"
                    bind:value={obj.username} />
                </div>
                <div class="form-group floating-label col-md-12">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    required
                    placeholder="Contraseña"
                    class="form-control "
                    bind:value={obj.password} />
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg">
                Iniciar sesión
              </button>

            </form>
          </div>

        </div>
      </div>
      <div
        class="col-lg-8 d-none d-md-block bg-cover"
        style="background-image: url('assets/img/login.svg');" />
    </div>
  </div>
</main>
