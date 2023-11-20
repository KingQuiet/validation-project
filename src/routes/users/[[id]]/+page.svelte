<script lang="ts">
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client'
    import spinner from '$lib/spinner.svg'
    
    export let data: PageData;

    const { form, message, enhance, errors, delayed } = superForm(data.form, {
        resetForm: true
    });
</script>

<h2>Superforms CRUD</h2>

{#if $message}
<h4>{$message}</h4>
{/if}

<div>
    {#if $form.id}
        <form action="/users">
            <button>Create User</button>
        </form>
    {/if}
    {#each data.userDB as user}
        <a href="/users/{user.id}">{user.name}</a><br />
    {/each}
</div>

<form method="POST" use:enhance>
    <input type="hidden" name="id" bind:value={$form.id}/>

    <label>
        Name<br/>
        <input name="name" bind:value={$form.name}/>
        {#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}
    </label>
    <br />
    <label>
        Email<br/>
        <input name="email" type="email" bind:value={$form.email}/>
        {#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}
    </label>

    <button>Submit</button>
    {#if $form.id}<button name="delete">Delete User</button>{/if}
    <!-- {#if $delayed}<img src={spinner} alt="Loading...">{/if} -->
</form>
