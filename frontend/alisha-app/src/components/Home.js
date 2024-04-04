import React, { useState, useEffect } from "react";
import { fetchItems } from "../services/service"; // Import the fetchItems function
import CardItem from "./CardItem";

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch items from the backend
  const fetchData = async () => {
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  return (
    <div className="body">
      {items.map((item) => (
        <CardItem
          itemID={item.itemID}
          itemName={item.itemName}
          itemPrice={item.itemPrice}
          itemQTY={item.itemQTY}
          displayPrice={true}
          imageName={item.imageName} // Pass the imageName field from the item object
          showControls={true}
        />
      ))}
    </div>
  );
}
