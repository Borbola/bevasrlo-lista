import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

// Adatbázis szimulálása
let items = [
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
];

// GET /api/items - Összes tétel lekérése
export async function GET() {
  return json(items);
}

// POST /api/items - Új tétel hozzáadása
export async function POST({ request }) {
  const data = await request.json();
  
  const newItem = {
    id: uuidv4(),
    name: data.name,
    quantity: data.quantity || 1,
    category: data.category || 'egyéb',
    completed: data.completed || false
  };
  
  items = [...items, newItem];
  return json(newItem, { status: 201 });
}