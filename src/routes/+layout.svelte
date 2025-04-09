<script>
    // Bootstrap 5 importálása
    import 'bootstrap/dist/css/bootstrap.min.css';
    import 'bootstrap-icons/font/bootstrap-icons.css';
    import { onMount } from 'svelte';
  
    onMount(() => {
      // Bootstrap JS importálása
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
    });
</script>
  
<div class="container py-4">
    <header class="pb-3 mb-4 border-bottom">
      <span class="fs-4 text-primary"><i class="bi bi-basket-fill me-2"></i>Bevásárló Lista</span>
    </header>
    
    <slot />
    
    <footer class="pt-3 mt-4 text-muted border-top">
      &copy; 2025 Bevásárló Lista Alkalmazás
    </footer>
</div>