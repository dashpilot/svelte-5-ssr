<script>
    import Sub from './Sub.svelte';
    let { name } = $props();
</script>

<main>
    Hello, <strong>{name}</strong>
    <Sub />
</main>
