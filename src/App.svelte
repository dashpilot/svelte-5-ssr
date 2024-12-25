<script>
    import Sub from './lib/Sub.svelte';
    let { name } = $props();
</script>

<main class="container">
    Hello, <strong>{name}</strong>
    <Sub />
</main>

<style>
    .container {
        margin-top: 50px;
    }
</style>
