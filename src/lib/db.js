// src/lib/db.js marad ugyanaz mint korábban
import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

// Adatbázis szimulálása
export const items = writable([
  {
    id: '1',
    name: 'Tej',
    quantity: 2,
    category: 'élelmiszer',
    completed: false
  },
  {
    id: '2',
    name: 'Kenyér',
    quantity: 1,
    category: 'élelmiszer',
    completed: false
  },
  {
    id: '3',
    name: 'Szappan',
    quantity: 3,
    category: 'háztartási cikk',
    completed: true
  }
]);

// Segédfüggvények az adatok CRUD műveleteihez
export function addItemToStore(item) {
  const newItem = {
    id: uuidv4(),
    name: item.name,
    quantity: item.quantity || 1,
    category: item.category || 'egyéb',
    completed: item.completed || false
  };
  
  items.update(currentItems => [...currentItems, newItem]);
  
  // API hívás a szerveroldali tároláshoz
  fetch('/api/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newItem)
  }).catch(err => console.error('Hiba történt az adatok mentésekor:', err));
  
  return newItem;
}

export function updateItemInStore(id, data) {
  let updatedItem;
  
  items.update(currentItems => {
    const index = currentItems.findIndex(item => item.id === id);
    if (index !== -1) {
      updatedItem = { ...currentItems[index], ...data };
      currentItems[index] = updatedItem;
    }
    return [...currentItems];
  });
  
  // API hívás a szerveroldali frissítéshez
  if (updatedItem) {
    fetch(`/api/items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).catch(err => console.error('Hiba történt az adatok frissítésekor:', err));
  }
  
  return updatedItem;
}

export function deleteItemFromStore(id) {
  let deletedItem;
  
  items.update(currentItems => {
    const index = currentItems.findIndex(item => item.id === id);
    if (index !== -1) {
      deletedItem = currentItems[index];
      return currentItems.filter(item => item.id !== id);
    }
    return currentItems;
  });
  
  // API hívás a szerveroldali törléshez
  if (deletedItem) {
    fetch(`/api/items/${id}`, {
      method: 'DELETE'
    }).catch(err => console.error('Hiba történt az adatok törlésekor:', err));
  }
  
  return deletedItem;
}

export function toggleItemCompletedInStore(id) {
  let item;
  
  items.update(currentItems => {
    const index = currentItems.findIndex(i => i.id === id);
    if (index !== -1) {
      item = currentItems[index];
      currentItems[index] = { ...item, completed: !item.completed };
    }
    return [...currentItems];
  });
  
  // API hívás a szerveroldali frissítéshez
  if (item) {
    fetch(`/api/items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed: !item.completed })
    }).catch(err => console.error('Hiba történt az adatok frissítésekor:', err));
  }
}