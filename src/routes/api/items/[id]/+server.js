import { json } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { getItemById, updateItem, deleteItem } from '$lib/db';

// GET /api/items/:id - Egy tétel lekérése
export async function GET({ params }) {
  const { id } = params;
  const item = getItemById(id);
  
  if (!item) {
    throw error(404, 'A tétel nem található');
  }
  
  return json(item);
}

// PATCH /api/items/:id - Tétel módosítása
export async function PATCH({ params, request }) {
  const { id } = params;
  const data = await request.json();
  
  const updatedItem = updateItem(id, data);
  
  if (!updatedItem) {
    throw error(404, 'A tétel nem található');
  }
  
  return json(updatedItem);
}

// DELETE /api/items/:id - Tétel törlése
export async function DELETE({ params }) {
  const { id } = params;
  
  const deletedItem = deleteItem(id);
  
  if (!deletedItem) {
    throw error(404, 'A tétel nem található');
  }
  
  return json(deletedItem);
}