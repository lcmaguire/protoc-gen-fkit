
  
<script>
import { auth } from "./firebase/firebase";
  import { currentUser, login } from "./firebase/auth";

  async function logOut() {
     await auth.signOut()
  }

</script>

<nav>
	<a href="/">home</a> |
	{#if $currentUser !== null}
		<button  on:click={logOut}>Log out</button>
	{:else}
		<button  on:click={login}>Log in</button>
	{/if}
</nav>

  
