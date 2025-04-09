<script>
  import { onMount } from 'svelte';
  import { items, addItemToStore, deleteItemFromStore, toggleItemCompletedInStore } from '$lib/db';
  
  let newItem = "";
  let newQuantity = 1;
  let newCategory = "élelmiszer";
  let isLoading = true;
  let error = null;
  
  // Kategóriák listája
  const categories = [
    "élelmiszer",
    "háztartási cikk",
    "ruházat",
    "elektronika",
    "egyéb"
  ];
  
  // Tételek betöltése
  async function loadItems() {
    isLoading = true;
    try {
      const response = await fetch('/api/items');
      if (!response.ok) throw new Error('Nem sikerült betölteni a tételeket');
      const itemsData = await response.json();
      
      // A kezdeti adatok betöltése a store-ba
      items.set(itemsData);
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }
  
  // Új tétel hozzáadása
  function addItem() {
    if (!newItem.trim()) return;
    
    try {
      addItemToStore({
        name: newItem,
        quantity: newQuantity,
        category: newCategory,
        completed: false
      });
      
      // Form reset
      newItem = "";
      newQuantity = 1;
      newCategory = "élelmiszer";
    } catch (err) {
      error = err.message;
    }
  }
  
  // Tétel törlése - most a store műveleteket használja
  function deleteItem(id) {
    try {
      deleteItemFromStore(id);
    } catch (err) {
      error = err.message;
    }
  }
  
  // Tétel állapotának módosítása - most a store műveleteket használja
  function toggleCompleted(id) {
    try {
      toggleItemCompletedInStore(id);
    } catch (err) {
      error = err.message;
    }
  }
  
  // Rendezés kategória szerint
  function getCategoryItems(category, allItems) {
    return allItems.filter(item => item.category === category);
  }
  
  onMount(loadItems);
</script>

<main>
  {#if error}
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Hiba!</strong> {error}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Bezárás" on:click={() => error = null}></button>
    </div>
  {/if}
  
  <div class="row g-3 mb-4">
    <div class="col-md-5">
      <input type="text" class="form-control" placeholder="Mit szeretnél vásárolni?" bind:value={newItem}>
    </div>
    <div class="col-md-2">
      <input type="number" class="form-control" min="1" bind:value={newQuantity}>
    </div>
    <div class="col-md-3">
      <select class="form-select" bind:value={newCategory}>
        {#each categories as category}
          <option value={category}>{category}</option>
        {/each}
      </select>
    </div>
    <div class="col-md-2">
      <button class="btn btn-primary w-100" on:click={addItem}>Hozzáadás</button>
    </div>
  </div>
  
  {#if isLoading}
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Betöltés...</span>
      </div>
    </div>
  {:else}
    {#if $items.length === 0}
      <div class="alert alert-info" role="alert">
        <i class="bi bi-info-circle me-2"></i> A bevásárló listád még üres. Adj hozzá tételeket!
      </div>
    {:else}
      {#each categories as category}
        {#if getCategoryItems(category, $items).length > 0}
          <div class="card mb-3">
            <div class="card-header bg-light">
              <i class="bi bi-tag me-2"></i>{category}
            </div>
            <ul class="list-group list-group-flush">
              {#each getCategoryItems(category, $items) as item (item.id)}
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" checked={item.completed} on:change={() => toggleCompleted(item.id)} id={`item-${item.id}`}>
                    <label class="form-check-label {item.completed ? 'text-decoration-line-through' : ''}" for={`item-${item.id}`}>
                      {item.name} <span class="badge bg-secondary rounded-pill">{item.quantity}</span>
                    </label>
                  </div>
                  <button class="btn btn-sm btn-outline-danger" on:click={() => deleteItem(item.id)}>
                    <i class="bi bi-trash"></i>
                  </button>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      {/each}
      
      <div class="d-flex justify-content-between align-items-center mt-4">
        <span class="fs-5">Összesen: {$items.length} tétel</span>
        <span class="fs-5">Megvásárolva: {$items.filter(item => item.completed).length}/{$items.length}</span>
      </div>
    {/if}
  {/if}
</main>