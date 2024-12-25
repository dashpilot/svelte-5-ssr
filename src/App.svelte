<script>
    import Sub from './lib/Sub.svelte';
    let { name } = $props();
</script>

<main>
    Hello, <strong>{name}</strong>
    <Sub />
</main>
