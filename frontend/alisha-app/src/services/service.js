const API_BASE_URL = "http://localhost:3000"; // Replace this with your API base URL

// Fetch all items from the API
export async function fetchItems() {
  const response = await fetch(`${API_BASE_URL}/items`);
  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }
  return response.json();
}

// Add a new item to the stock
export async function addItem(itemData) {
  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      throw new Error("Failed to add item to stock");
    }

    return response.json();
  } catch (error) {
    console.error("Error adding stock:", error.message);
    throw error;
  }
}

// Updates the quantity of a specific item in the stock
export async function updateStockQuantity(itemID, newQuantity) {
  const response = await fetch(`${API_BASE_URL}/items/${itemID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newQuantity }),
  });
  if (!response.ok) {
    throw new Error("Failed to update stock quantity");
  }
}

export async function fetchSales() {
  const response = await fetch(`${API_BASE_URL}/sales`);
  if (!response.ok) {
    throw new Error("Failed to fetch sales records");
  }
  return response.json();
}

// Adds a new sale record to the database
export async function recordSale(saleData) {
  try {
    const response = await fetch(`${API_BASE_URL}/sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(saleData),
    });

    if (!response.ok) {
      throw new Error("Failed to record sale");
    }

    return response.json();
  } catch (error) {
    console.error("Error recording sale:", error.message);
    throw error;
  }
}

// Add more functions for other API endpoints if needed
