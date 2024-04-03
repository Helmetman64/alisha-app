const API_BASE_URL = 'http://localhost:3000'; // Replace this with your API base URL

export async function fetchItems() {
  const response = await fetch(`${API_BASE_URL}/items`);
  if (!response.ok) {
    throw new Error('Failed to fetch items');
  }
  return response.json();
}

// Add more functions for other API endpoints if needed
