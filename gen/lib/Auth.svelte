
  
<script>
import { auth } from "./firebase/firebase";
  import { currentUser, login } from "./firebase/auth";

  async function logOut() {
     await auth.signOut()
  }

</script>

<nav class="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
	<div class="container-fluid">
		<a class="navbar-brand" href="/">Home</a>
		<form class="d-flex">
			{#if $currentUser !== null}
                <button type="button" class="btn btn-outline-danger" on:click={logOut}>Log out</button>
			{:else}
                <button type="button" class="btn btn-outline-success" on:click={login} >Log in</button>
			{/if}
		</form>
	</div>
</nav>

  
